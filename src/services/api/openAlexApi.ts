
/**
 * Service for interacting with the OpenAlex API
 */

import { ApiResearcher } from '../citationNetworkService';

interface OpenAlexAuthor {
  id: string;
  display_name: string;
  orcid?: string;
  works_count: number;
  cited_by_count: number;
  institutions?: Array<{
    id: string;
    display_name: string;
    country_code?: string;
  }>;
}

interface OpenAlexWork {
  id: string;
  title: string;
  publication_year: number;
  doi?: string;
  cited_by_count: number;
  url?: string;
  authorships: Array<{
    author: {
      id: string;
      display_name: string;
    };
    institutions?: Array<{
      id: string;
      display_name: string;
    }>;
  }>;
  primary_location?: {
    source?: {
      display_name: string;
    };
  };
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

export async function getAuthorDetails(authorId: string): Promise<ApiResearcher | null> {
  try {
    // Remove 'https://openalex.org/' prefix if present
    const cleanId = authorId.replace('https://openalex.org/', '');
    const response = await fetch(`https://api.openalex.org/${cleanId}`);
    
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    
    const author = await response.json();
    
    return {
      id: author.id,
      name: author.display_name,
      institution: author.institutions?.[0]?.display_name || "",
      interests: [],
      paperCount: author.works_count,
      source: 'openalex'
    };
  } catch (error) {
    console.error("Error fetching OpenAlex author details:", error);
    return null;
  }
}

export async function getAuthorWorks(authorId: string): Promise<OpenAlexWork[]> {
  try {
    // Remove 'https://openalex.org/' prefix if present
    const cleanId = authorId.replace('https://openalex.org/', '');
    const response = await fetch(`https://api.openalex.org/works?filter=author.id:${cleanId}&per-page=50`);
    
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
    // Remove 'https://openalex.org/' prefix if present
    const cleanId = workId.replace('https://openalex.org/', '');
    const response = await fetch(`https://api.openalex.org/works?filter=cites:${cleanId}&per-page=50`);
    
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

export async function searchWorksByTitle(title: string): Promise<OpenAlexWork[]> {
  try {
    const response = await fetch(`https://api.openalex.org/works?filter=title.search:${encodeURIComponent(title)}`);
    
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching OpenAlex works:", error);
    return [];
  }
}
