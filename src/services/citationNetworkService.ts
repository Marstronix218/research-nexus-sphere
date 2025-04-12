
/**
 * Service for creating citation networks using data from multiple APIs
 */
import * as semanticScholarApi from './api/semanticScholarApi';
import * as openAlexApi from './api/openAlexApi';
import * as crossrefApi from './api/crossrefApi';
import * as openCitationsApi from './api/openCitationsApi';
import { Node, Link, Researcher } from '@/data/mockData';

// Extended types for citation network
export interface CitationNode extends Node {
  title?: string;
  year?: number;
  doi?: string;
  authors?: string[];
  venue?: string;
  type?: 'researcher' | 'paper';
  paperCount?: number;
  citationCount?: number;
}

export interface CitationLink extends Link {
  year?: number;
  type?: 'citation' | 'reference';
  weight?: number; // Number of citations
}

export interface CitationNetworkData {
  nodes: CitationNode[];
  links: CitationLink[];
}

// Extended types for researchers with source information
export interface ApiResearcher extends Partial<Researcher> {
  source?: string;
  paperCount?: number;
}

// Search for researchers across multiple APIs
export async function searchResearchers(name: string): Promise<ApiResearcher[]> {
  try {
    // Search using Semantic Scholar API
    const semanticScholars = await semanticScholarApi.searchAuthorsByName(name);
    const openAlexAuthors = await openAlexApi.searchAuthorsByName(name);
    
    // Combine and deduplicate results
    const researchers: ApiResearcher[] = [];
    
    // Add Semantic Scholar results
    for (const author of semanticScholars) {
      researchers.push({
        id: author.authorId,
        name: author.name,
        institution: author.affiliations?.[0] || "",
        interests: [],
        source: 'semanticscholar'
      });
    }
    
    // Add OpenAlex results, avoiding duplicates by name
    for (const author of openAlexAuthors) {
      if (!researchers.some(r => r.name?.toLowerCase() === author.display_name.toLowerCase())) {
        researchers.push({
          id: author.id,
          name: author.display_name,
          institution: author.institutions?.[0]?.display_name || "",
          interests: [],
          source: 'openalex'
        });
      }
    }
    
    return researchers;
  } catch (error) {
    console.error("Error searching researchers:", error);
    return [];
  }
}

// Get detailed researcher profile
export async function getResearcherDetails(id: string, source: string = 'semanticscholar'): Promise<ApiResearcher | null> {
  try {
    if (source === 'semanticscholar') {
      return await semanticScholarApi.getAuthorDetails(id);
    } else if (source === 'openalex') {
      return await openAlexApi.getAuthorDetails(id);
    }
    return null;
  } catch (error) {
    console.error("Error fetching researcher details:", error);
    return null;
  }
}

// Create a researcher-centric citation network
export async function createResearcherCitationNetwork(mainResearcherId: string, source: string = 'semanticscholar'): Promise<CitationNetworkData> {
  const nodes: CitationNode[] = [];
  const links: CitationLink[] = [];
  const citationMap = new Map<string, Map<string, number>>(); // source -> target -> count
  
  try {
    // Get the main researcher's details
    const mainResearcher = await getResearcherDetails(mainResearcherId, source);
    if (!mainResearcher) {
      throw new Error("Could not find main researcher details");
    }
    
    // Add main researcher as a node
    nodes.push({
      id: mainResearcherId,
      name: mainResearcher.name || "Unknown",
      type: "researcher",
      val: 2, // Make the main researcher slightly larger
      paperCount: mainResearcher.paperCount || 0
    });
    
    // Get researcher's papers
    let papers: any[] = [];
    
    if (source === 'semanticscholar') {
      papers = await semanticScholarApi.getAuthorPapers(mainResearcherId);
    } else if (source === 'openalex') {
      papers = await openAlexApi.getAuthorWorks(mainResearcherId);
    }
    
    if (papers.length === 0) {
      throw new Error("No papers found for researcher");
    }
    
    // Collect co-authors from these papers
    const coauthors = new Map<string, {id: string, name: string, count: number, source: string}>();
    
    // Process papers to extract co-authors and citation relationships
    for (const paper of papers) {
      if (source === 'semanticscholar') {
        // Process Semantic Scholar papers
        for (const author of paper.authors || []) {
          if (author.authorId && author.authorId !== mainResearcherId) {
            if (coauthors.has(author.authorId)) {
              coauthors.get(author.authorId)!.count += 1;
            } else {
              coauthors.set(author.authorId, {
                id: author.authorId,
                name: author.name,
                count: 1,
                source: 'semanticscholar'
              });
            }
          }
        }
        
        // Fetch citations for this paper to find citing authors
        const paperId = paper.paperId;
        try {
          const citations = await semanticScholarApi.getPaperCitations(paperId);
          
          for (const citingPaper of citations) {
            for (const citingAuthor of citingPaper.authors || []) {
              if (citingAuthor.authorId && citingAuthor.authorId !== mainResearcherId) {
                // Record citation from citing author to main researcher
                if (!citationMap.has(citingAuthor.authorId)) {
                  citationMap.set(citingAuthor.authorId, new Map());
                }
                
                const targetMap = citationMap.get(citingAuthor.authorId)!;
                targetMap.set(mainResearcherId, (targetMap.get(mainResearcherId) || 0) + 1);
                
                // Add this author if not already in coauthors
                if (!coauthors.has(citingAuthor.authorId)) {
                  coauthors.set(citingAuthor.authorId, {
                    id: citingAuthor.authorId,
                    name: citingAuthor.name,
                    count: 0, // Not a co-author, just a citer
                    source: 'semanticscholar'
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching citations for paper ${paperId}:`, error);
        }
      } else if (source === 'openalex') {
        // Process OpenAlex works
        for (const authorship of paper.authorships || []) {
          const authorId = authorship.author.id;
          if (authorId && authorId !== mainResearcherId) {
            if (coauthors.has(authorId)) {
              coauthors.get(authorId)!.count += 1;
            } else {
              coauthors.set(authorId, {
                id: authorId,
                name: authorship.author.display_name,
                count: 1,
                source: 'openalex'
              });
            }
          }
        }
        
        // Get papers that cite this work
        try {
          const citations = await openAlexApi.getWorkCitations(paper.id);
          
          for (const citingWork of citations) {
            for (const authorship of citingWork.authorships || []) {
              const authorId = authorship.author.id;
              if (authorId && authorId !== mainResearcherId) {
                // Record citation from citing author to main researcher
                if (!citationMap.has(authorId)) {
                  citationMap.set(authorId, new Map());
                }
                
                const targetMap = citationMap.get(authorId)!;
                targetMap.set(mainResearcherId, (targetMap.get(mainResearcherId) || 0) + 1);
                
                // Add this author if not already in coauthors
                if (!coauthors.has(authorId)) {
                  coauthors.set(authorId, {
                    id: authorId,
                    name: authorship.author.display_name,
                    count: 0, // Not a co-author, just a citer
                    source: 'openalex'
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching citations for work ${paper.id}:`, error);
        }
      }
      
      // Limit API calls for performance
      if (coauthors.size > 25) break;
    }
    
    // Add co-authors and citers as nodes
    for (const [authorId, authorData] of coauthors.entries()) {
      nodes.push({
        id: authorId,
        name: authorData.name,
        type: "researcher",
        val: 1 + Math.min(authorData.count * 0.1, 0.5) // Size based on collaboration but smaller scale
      });
      
      // Add co-authorship links (bidirectional)
      if (authorData.count > 0) {
        links.push({
          source: mainResearcherId,
          target: authorId,
          value: authorData.count, // Collaboration strength
          type: 'reference',
          weight: authorData.count
        });
        
        links.push({
          source: authorId,
          target: mainResearcherId,
          value: authorData.count, // Collaboration strength
          type: 'reference',
          weight: authorData.count
        });
      }
    }
    
    // Add citation links between authors
    for (const [sourceId, targetMap] of citationMap.entries()) {
      for (const [targetId, count] of targetMap.entries()) {
        links.push({
          source: sourceId,
          target: targetId,
          value: count,
          type: 'citation',
          weight: count
        });
      }
    }
    
    // Try to get citations among co-authors too (limited to top co-authors)
    const topCoauthors = Array.from(coauthors.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(a => a.id);
    
    for (const authorId of topCoauthors) {
      try {
        let authorPapers: any[] = [];
        
        if (source === 'semanticscholar') {
          authorPapers = await semanticScholarApi.getAuthorPapers(authorId);
        } else if (source === 'openalex') {
          authorPapers = await openAlexApi.getAuthorWorks(authorId);
        }
        
        // Just check a few papers to limit API calls
        for (let i = 0; i < Math.min(authorPapers.length, 3); i++) {
          const paper = authorPapers[i];
          let citations: any[] = [];
          
          if (source === 'semanticscholar') {
            citations = await semanticScholarApi.getPaperCitations(paper.paperId);
          } else if (source === 'openalex') {
            citations = await openAlexApi.getWorkCitations(paper.id);
          }
          
          // Check if any co-authors cite this author
          for (const citation of citations) {
            let citingAuthors: any[] = [];
            
            if (source === 'semanticscholar') {
              citingAuthors = citation.authors || [];
            } else if (source === 'openalex') {
              citingAuthors = citation.authorships?.map((a: any) => a.author) || [];
            }
            
            for (const citingAuthor of citingAuthors) {
              const citingAuthorId = citingAuthor.authorId || citingAuthor.id;
              if (coauthors.has(citingAuthorId) && citingAuthorId !== authorId) {
                // Add citation link between co-authors
                if (!citationMap.has(citingAuthorId)) {
                  citationMap.set(citingAuthorId, new Map());
                }
                
                const targetMap = citationMap.get(citingAuthorId)!;
                targetMap.set(authorId, (targetMap.get(authorId) || 0) + 1);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error processing co-author citations for ${authorId}:`, error);
      }
    }
    
    // Add the additional citation links
    for (const [sourceId, targetMap] of citationMap.entries()) {
      for (const [targetId, count] of targetMap.entries()) {
        // Check if this link already exists
        if (!links.some(l => l.source === sourceId && l.target === targetId)) {
          links.push({
            source: sourceId,
            target: targetId,
            value: count,
            type: 'citation',
            weight: count
          });
        }
      }
    }
    
    return { nodes, links };
  } catch (error) {
    console.error("Error creating researcher citation network:", error);
    return { nodes, links };
  }
}

// Create co-authorship network (with citation counts between authors)
export async function createCoAuthorNetwork(researcherId: string, source: string = 'semanticscholar'): Promise<CitationNetworkData> {
  const nodes: CitationNode[] = [];
  const links: CitationLink[] = [];
  const coauthors = new Map<string, {name: string, count: number}>();
  
  try {
    // Get researcher's papers
    let papers: any[] = [];
    let researcherName = "";
    
    if (source === 'semanticscholar') {
      const authorDetails = await semanticScholarApi.getAuthorDetails(researcherId);
      researcherName = authorDetails?.name || "Unknown";
      papers = await semanticScholarApi.getAuthorPapers(researcherId);
    } else if (source === 'openalex') {
      const authorDetails = await openAlexApi.getAuthorDetails(researcherId);
      researcherName = authorDetails?.name || "Unknown";
      papers = await openAlexApi.getAuthorWorks(researcherId);
    }
    
    // Create node for the main researcher
    nodes.push({
      id: researcherId,
      name: researcherName,
      type: "researcher",
      val: 2 // Make main researcher node larger
    });
    
    // Process papers to find co-authors
    for (const paper of papers) {
      // For Semantic Scholar
      if (source === 'semanticscholar' && paper.authors) {
        for (const author of paper.authors) {
          const authorId = author.authorId;
          // Skip the main researcher
          if (!authorId || authorId === researcherId) continue;
          
          // Count collaborations
          if (coauthors.has(authorId)) {
            coauthors.get(authorId)!.count += 1;
          } else {
            coauthors.set(authorId, {name: author.name, count: 1});
          }
        }
      }
      // For OpenAlex
      else if (source === 'openalex' && paper.authorships) {
        for (const authorship of paper.authorships) {
          const authorId = authorship.author.id;
          const authorName = authorship.author.display_name;
          
          // Skip the main researcher
          if (authorId === researcherId) continue;
          
          // Count collaborations
          if (coauthors.has(authorId)) {
            coauthors.get(authorId)!.count += 1;
          } else {
            coauthors.set(authorId, {name: authorName, count: 1});
          }
        }
      }
    }
    
    // Add co-author nodes and links
    for (const [authorId, authorData] of coauthors.entries()) {
      // Add co-author node
      nodes.push({
        id: authorId,
        name: authorData.name,
        type: "researcher",
        val: 1 + Math.min(authorData.count * 0.1, 0.5) // Size based on collaboration count but capped smaller
      });
      
      // Add collaboration link
      links.push({
        source: researcherId,
        target: authorId,
        value: authorData.count, // Weight based on number of collaborations
        weight: authorData.count
      });
    }
    
    return { nodes, links };
  } catch (error) {
    console.error("Error creating co-author network:", error);
    return { nodes, links };
  }
}

// Helper function to create a simple sample network for testing
export function createSampleResearcherNetwork(): CitationNetworkData {
  const nodes: CitationNode[] = [
    { id: "1", name: "Alice Smith", type: "researcher", val: 2 },
    { id: "2", name: "Bob Jones", type: "researcher", val: 1.5 },
    { id: "3", name: "Carol Taylor", type: "researcher", val: 1.5 },
    { id: "4", name: "David Brown", type: "researcher", val: 1 },
    { id: "5", name: "Emma Wilson", type: "researcher", val: 1 },
    { id: "6", name: "Frank Miller", type: "researcher", val: 1 },
    { id: "7", name: "Grace Davis", type: "researcher", val: 1 }
  ];
  
  const links: CitationLink[] = [
    { source: "2", target: "1", value: 3, weight: 3 },
    { source: "3", target: "1", value: 2, weight: 2 },
    { source: "4", target: "1", value: 1, weight: 1 },
    { source: "4", target: "2", value: 2, weight: 2 },
    { source: "5", target: "3", value: 1, weight: 1 },
    { source: "1", target: "6", value: 2, weight: 2 },
    { source: "6", target: "7", value: 1, weight: 1 },
    { source: "3", target: "2", value: 1, weight: 1 }
  ];
  
  return { nodes, links };
}
