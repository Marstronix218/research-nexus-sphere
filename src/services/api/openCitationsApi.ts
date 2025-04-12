
/**
 * Service for interacting with the OpenCitations API
 */

interface OpenCitationReference {
  citing: string; // DOI of the citing paper
  cited: string;  // DOI of the cited paper
  creation: string; // Date when the citation was created
  timespan: string; // Time between publication of cited and citing entities
  journal_sc: string; // Whether the citation is from the same journal
  author_sc: string; // Whether the citation is from the same author
}

export async function getCitationsForDOI(doi: string): Promise<OpenCitationReference[]> {
  try {
    const response = await fetch(`https://opencitations.net/index/coci/api/v1/citations/${encodeURIComponent(doi)}`);
    
    if (!response.ok) {
      throw new Error(`OpenCitations API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching OpenCitations citations:", error);
    return [];
  }
}

export async function getReferencesForDOI(doi: string): Promise<OpenCitationReference[]> {
  try {
    const response = await fetch(`https://opencitations.net/index/coci/api/v1/references/${encodeURIComponent(doi)}`);
    
    if (!response.ok) {
      throw new Error(`OpenCitations API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching OpenCitations references:", error);
    return [];
  }
}

export async function getCitationCountForDOI(doi: string): Promise<number> {
  try {
    const response = await fetch(`https://opencitations.net/index/coci/api/v1/citation-count/${encodeURIComponent(doi)}`);
    
    if (!response.ok) {
      throw new Error(`OpenCitations API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0]?.count || 0;
  } catch (error) {
    console.error("Error fetching OpenCitations citation count:", error);
    return 0;
  }
}
