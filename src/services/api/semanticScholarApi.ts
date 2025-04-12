
/**
 * Service for interacting with the Semantic Scholar API
 */
import { Researcher } from "@/data/mockData";

interface SemanticScholarAuthor {
  authorId: string;
  name: string;
  url: string;
  affiliations: string[];
}

interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract: string;
  url: string;
  venue: string;
  year: number;
  authors: SemanticScholarAuthor[];
  citationCount: number;
  influentialCitationCount: number;
}

interface SemanticScholarCitation {
  paperId: string;
  title: string;
  authors: SemanticScholarAuthor[];
  venue: string;
  year: number;
}

export async function searchAuthorsByName(name: string): Promise<SemanticScholarAuthor[]> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(name)}&fields=authorId,name,url,affiliations`);
    
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

export async function getAuthorDetails(authorId: string): Promise<Partial<Researcher> | null> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/author/${authorId}?fields=authorId,name,url,affiliations,paperCount,citationCount,hIndex,papers.title,papers.year,papers.authors`);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert to our application's Researcher format
    return {
      id: data.authorId,
      name: data.name,
      institution: data.affiliations?.[0] || "",
      interests: [], // Not provided by Semantic Scholar API
      paperCount: data.paperCount,
      citationCount: data.citationCount,
      hIndex: data.hIndex,
      papers: data.papers || []
    };
  } catch (error) {
    console.error("Error fetching Semantic Scholar author details:", error);
    return null;
  }
}

export async function getAuthorCitations(authorId: string): Promise<SemanticScholarCitation[]> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=paperId,title,authors,venue,year,citations.paperId,citations.title,citations.authors,citations.venue,citations.year`);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract all citations from the papers
    const citations: SemanticScholarCitation[] = [];
    if (data.data) {
      data.data.forEach((paper: any) => {
        if (paper.citations) {
          citations.push(...paper.citations);
        }
      });
    }
    
    return citations;
  } catch (error) {
    console.error("Error fetching Semantic Scholar author citations:", error);
    return [];
  }
}

export async function getPaperCitations(paperId: string): Promise<SemanticScholarCitation[]> {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/${paperId}/citations?fields=paperId,title,authors,venue,year`);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Semantic Scholar paper citations:", error);
    return [];
  }
}
