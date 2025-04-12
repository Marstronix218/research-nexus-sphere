
/**
 * Service for interacting with the OpenAlex API
 */
import { Researcher } from "@/data/mockData";

interface OpenAlexAuthor {
  id: string;
  display_name: string;
  orcid: string | null;
  works_count: number;
  cited_by_count: number;
  institutions: Array<{
    id: string;
    display_name: string;
    country_code: string;
    type: string;
  }>;
}

interface OpenAlexWork {
  id: string;
  doi: string | null;
  title: string;
  publication_year: number;
  cited_by_count: number;
  authorships: Array<{
    author: {
      id: string;
      display_name: string;
    };
    institutions: Array<{
      id: string;
      display_name: string;
    }>;
  }>;
}

export async function searchAuthorsByName(name: string): Promise<OpenAlexAuthor[]> {
  try {
    const response = await fetch(`https://api.openalex.org/authors?filter=display_name.search:${encodeURIComponent(name)}`);
    
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching OpenAlex authors:", error);
    return [];
  }
}

export async function getAuthorDetails(authorId: string): Promise<Partial<Researcher> | null> {
  try {
    // OpenAlex requires the full ID with the prefix
    const formattedId = authorId.startsWith('https://openalex.org/') ? authorId : `https://openalex.org/${authorId}`;
    const response = await fetch(`${formattedId}`);
    
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract research interests from top concepts
    const interests = data.x_concepts?.slice(0, 5).map((concept: any) => concept.display_name) || [];
    
    // Convert to our application's Researcher format
    return {
      id: data.id,
      name: data.display_name,
      institution: data.last_known_institution?.display_name || "",
      interests,
      paperCount: data.works_count,
      citationCount: data.cited_by_count,
      hIndex: data.summary_stats?.h_index || 0
    };
  } catch (error) {
    console.error("Error fetching OpenAlex author details:", error);
    return null;
  }
}

export async function getAuthorWorks(authorId: string): Promise<OpenAlexWork[]> {
  try {
    // OpenAlex requires the full ID with the prefix
    const formattedId = authorId.startsWith('https://openalex.org/') ? authorId : `https://openalex.org/${authorId}`;
    const response = await fetch(`https://api.openalex.org/works?filter=author.id:${encodeURIComponent(formattedId)}`);
    
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching OpenAlex author works:", error);
    return [];
  }
}

export async function getWorkCitations(workId: string): Promise<OpenAlexWork[]> {
  try {
    // OpenAlex requires the full ID with the prefix
    const formattedId = workId.startsWith('https://openalex.org/') ? workId : `https://openalex.org/${workId}`;
    const response = await fetch(`https://api.openalex.org/works?filter=cites:${encodeURIComponent(formattedId)}`);
    
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching OpenAlex work citations:", error);
    return [];
  }
}
