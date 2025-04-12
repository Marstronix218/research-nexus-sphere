
/**
 * Service for interacting with the Semantic Scholar API
 */

import { ApiResearcher } from '../citationNetworkService';

interface SemanticScholarAuthor {
  authorId: string;
  name: string;
  url: string;
  affiliations: string[];
  paperCount: number;
  citationCount: number;
  hIndex: number;
}

interface SemanticScholarPaper {
  paperId: string;
  title: string;
  venue: string;
  year: number;
  authors: Array<{
    authorId: string;
    name: string;
  }>;
  citationCount: number;
}

export async function searchAuthorsByName(name: string): Promise<SemanticScholarAuthor[]> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(name)}&fields=name,affiliations,paperCount`);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching Semantic Scholar authors:", error);
    return [];
  }
}

export async function getAuthorDetails(authorId: string): Promise<ApiResearcher | null> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/author/${authorId}?fields=name,affiliations,paperCount,citationCount,hIndex`);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    const author = await response.json();
    
    return {
      id: author.authorId,
      name: author.name,
      institution: author.affiliations?.[0] || "",
      interests: [],
      paperCount: author.paperCount,
      source: 'semanticscholar'
    };
  } catch (error) {
    console.error("Error fetching Semantic Scholar author details:", error);
    return null;
  }
}

export async function getAuthorPapers(authorId: string): Promise<SemanticScholarPaper[]> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=title,venue,year,authors,citationCount&limit=100`);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Semantic Scholar author papers:", error);
    return [];
  }
}

export async function getPaperDetails(paperId: string): Promise<SemanticScholarPaper | null> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/${paperId}?fields=title,venue,year,authors,citationCount`);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching Semantic Scholar paper details:", error);
    return null;
  }
}

export async function getPaperCitations(paperId: string): Promise<SemanticScholarPaper[]> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/${paperId}/citations?fields=title,venue,year,authors&limit=50`);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data?.map((item: any) => item.citingPaper) || [];
  } catch (error) {
    console.error("Error fetching Semantic Scholar paper citations:", error);
    return [];
  }
}

export async function getAuthorCitations(authorId: string): Promise<SemanticScholarPaper[]> {
  // Using the papers endpoint as a proxy to get papers that cite the author's work
  try {
    const authorPapers = await getAuthorPapers(authorId);
    
    // To avoid too many API calls, only use top papers
    const topPapers = authorPapers
      .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
      .slice(0, 10);
    
    // Collect papers citing the top papers
    let citingPapers: SemanticScholarPaper[] = [];
    
    for (const paper of topPapers) {
      try {
        const paperCitations = await getPaperCitations(paper.paperId);
        citingPapers = [...citingPapers, ...paperCitations.slice(0, 5)]; // Limit to 5 citing papers per paper
      } catch (error) {
        console.error(`Error fetching citations for paper ${paper.paperId}:`, error);
      }
    }
    
    // Remove duplicates based on paperId
    const uniquePapers = Array.from(
      new Map(citingPapers.map(paper => [paper.paperId, paper])).values()
    );
    
    return uniquePapers;
  } catch (error) {
    console.error("Error fetching Semantic Scholar author citations:", error);
    return [];
  }
}
