
/**
 * Service for creating citation networks using data from multiple APIs
 */
import * as semanticScholarApi from './api/semanticScholarApi';
import * as openAlexApi from './api/openAlexApi';
import * as crossrefApi from './api/crossrefApi';
import * as openCitationsApi from './api/openCitationsApi';
import { Node, Link, Researcher } from '@/data/mockData';

export interface CitationNode extends Node {
  title?: string;
  year?: number;
  doi?: string;
  authors?: string[];
  venue?: string;
}

export interface CitationLink extends Link {
  year?: number;
  type?: 'citation' | 'reference';
}

export interface CitationNetworkData {
  nodes: CitationNode[];
  links: CitationLink[];
}

// Search for researchers across multiple APIs
export async function searchResearchers(name: string): Promise<Partial<Researcher>[]> {
  try {
    // Search using Semantic Scholar API
    const semanticScholars = await semanticScholarApi.searchAuthorsByName(name);
    const openAlexAuthors = await openAlexApi.searchAuthorsByName(name);
    
    // Combine and deduplicate results
    const researchers: Partial<Researcher>[] = [];
    
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
export async function getResearcherDetails(id: string, source: string = 'semanticscholar'): Promise<Partial<Researcher> | null> {
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

// Create a citation network for a researcher
export async function createResearcherCitationNetwork(researcherId: string, source: string = 'semanticscholar'): Promise<CitationNetworkData> {
  const nodes: CitationNode[] = [];
  const links: CitationLink[] = [];
  const processedNodes = new Set<string>();
  
  try {
    // Different approach based on the data source
    if (source === 'semanticscholar') {
      // Get author's papers and their citations
      const authorDetails = await semanticScholarApi.getAuthorDetails(researcherId);
      const authorCitations = await semanticScholarApi.getAuthorCitations(researcherId);
      
      if (authorDetails) {
        // Create node for the researcher
        const researcherNode: CitationNode = {
          id: researcherId,
          name: authorDetails.name || "Unknown",
          type: "researcher",
          val: 3 // Make researcher node larger
        };
        nodes.push(researcherNode);
        processedNodes.add(researcherId);
        
        // Process citations
        for (const citation of authorCitations) {
          // Add paper node if not already added
          if (!processedNodes.has(citation.paperId)) {
            const paperNode: CitationNode = {
              id: citation.paperId,
              name: citation.title || "Unknown Paper",
              type: "paper",
              title: citation.title,
              year: citation.year,
              authors: citation.authors.map(a => a.name),
              venue: citation.venue,
              val: 1
            };
            nodes.push(paperNode);
            processedNodes.add(citation.paperId);
          }
          
          // Add citation link
          links.push({
            source: researcherId,
            target: citation.paperId,
            value: 1,
            type: 'citation',
            year: citation.year
          });
        }
      }
    } else if (source === 'openalex') {
      // Get author's works
      const authorDetails = await openAlexApi.getAuthorDetails(researcherId);
      const authorWorks = await openAlexApi.getAuthorWorks(researcherId);
      
      if (authorDetails) {
        // Create node for the researcher
        const researcherNode: CitationNode = {
          id: researcherId,
          name: authorDetails.name || "Unknown",
          type: "researcher",
          val: 3 // Make researcher node larger
        };
        nodes.push(researcherNode);
        processedNodes.add(researcherId);
        
        // Process works and their citations
        for (const work of authorWorks) {
          // Add paper node
          if (!processedNodes.has(work.id)) {
            const paperNode: CitationNode = {
              id: work.id,
              name: work.title || "Unknown Paper",
              type: "paper",
              title: work.title,
              year: work.publication_year,
              authors: work.authorships.map(a => a.author.display_name),
              doi: work.doi || undefined,
              val: 1
            };
            nodes.push(paperNode);
            processedNodes.add(work.id);
          }
          
          // Add link from researcher to paper
          links.push({
            source: researcherId,
            target: work.id,
            value: 1,
            year: work.publication_year
          });
          
          // Limit to avoid too many API calls
          if (processedNodes.size > 50) break;
        }
      }
    }
    
    return { nodes, links };
  } catch (error) {
    console.error("Error creating researcher citation network:", error);
    return { nodes, links };
  }
}

// Create a citation network from a set of papers
export async function createPaperCitationNetwork(paperIds: string[], maxDepth: number = 1): Promise<CitationNetworkData> {
  const nodes: CitationNode[] = [];
  const links: CitationLink[] = [];
  const processedNodes = new Set<string>();
  
  try {
    // Process the initial set of papers
    for (const paperId of paperIds) {
      await processPaperCitations(paperId, 0);
    }
    
    // Recursive function to process a paper and its citations up to maxDepth
    async function processPaperCitations(paperId: string, depth: number) {
      if (depth >= maxDepth || processedNodes.has(paperId)) return;
      
      processedNodes.add(paperId);
      
      // Get paper details and citations from Semantic Scholar
      try {
        const paperCitations = await semanticScholarApi.getPaperCitations(paperId);
        
        // Add paper node if not already added
        if (!nodes.some(node => node.id === paperId)) {
          // Try to get more details from APIs
          // For simplicity, we're adding a placeholder node here
          const paperNode: CitationNode = {
            id: paperId,
            name: `Paper ${paperId}`,
            type: "paper",
            val: 1
          };
          nodes.push(paperNode);
        }
        
        // Process citations
        for (const citation of paperCitations) {
          // Add citation node if not already added
          if (!nodes.some(node => node.id === citation.paperId)) {
            const citationNode: CitationNode = {
              id: citation.paperId,
              name: citation.title || "Unknown Paper",
              type: "paper",
              title: citation.title,
              year: citation.year,
              authors: citation.authors.map(a => a.name),
              venue: citation.venue,
              val: 1
            };
            nodes.push(citationNode);
          }
          
          // Add citation link
          links.push({
            source: paperId,
            target: citation.paperId,
            value: 1,
            type: 'citation',
            year: citation.year
          });
          
          // Recursively process this citation's citations
          if (depth + 1 < maxDepth) {
            await processPaperCitations(citation.paperId, depth + 1);
          }
        }
      } catch (error) {
        console.error(`Error processing citations for paper ${paperId}:`, error);
      }
    }
    
    return { nodes, links };
  } catch (error) {
    console.error("Error creating paper citation network:", error);
    return { nodes, links };
  }
}

export async function createCoAuthorNetwork(researcherId: string, source: string = 'semanticscholar'): Promise<CitationNetworkData> {
  const nodes: CitationNode[] = [];
  const links: CitationLink[] = [];
  const processedNodes = new Set<string>();
  const coauthors = new Map<string, {name: string, count: number}>();
  
  try {
    // Get researcher's papers
    let papers: any[] = [];
    let researcherName = "";
    
    if (source === 'semanticscholar') {
      const authorDetails = await semanticScholarApi.getAuthorDetails(researcherId);
      researcherName = authorDetails?.name || "Unknown";
      // Here we would get papers for Semantic Scholar, but we'll simplify
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
      val: 3 // Make main researcher node larger
    });
    processedNodes.add(researcherId);
    
    // Process papers to find co-authors
    for (const paper of papers) {
      // For OpenAlex
      if (source === 'openalex' && paper.authorships) {
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
        val: 1 + authorData.count * 0.5 // Size based on collaboration count
      });
      
      // Add collaboration link
      links.push({
        source: researcherId,
        target: authorId,
        value: authorData.count // Weight based on number of collaborations
      });
    }
    
    return { nodes, links };
  } catch (error) {
    console.error("Error creating co-author network:", error);
    return { nodes, links };
  }
}
