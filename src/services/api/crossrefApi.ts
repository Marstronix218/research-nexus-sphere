
/**
 * Service for interacting with the Crossref API
 */

interface CrossrefWork {
  DOI: string;
  title: string[];
  author: Array<{
    given: string;
    family: string;
    ORCID?: string;
  }>;
  "container-title": string[];
  published: {
    "date-parts": number[][];
  };
}

export async function searchWorksByAuthor(authorName: string): Promise<CrossrefWork[]> {
  try {
    const response = await fetch(`https://api.crossref.org/works?query.author=${encodeURIComponent(authorName)}&rows=20`);
    
    if (!response.ok) {
      throw new Error(`Crossref API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.message?.items || [];
  } catch (error) {
    console.error("Error searching Crossref works:", error);
    return [];
  }
}

export async function getWorkByDOI(doi: string): Promise<CrossrefWork | null> {
  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    
    if (!response.ok) {
      throw new Error(`Crossref API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.message || null;
  } catch (error) {
    console.error("Error fetching Crossref work:", error);
    return null;
  }
}

export async function getWorkReferences(doi: string): Promise<CrossrefWork[]> {
  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    
    if (!response.ok) {
      throw new Error(`Crossref API error: ${response.status}`);
    }
    
    const data = await response.json();
    const references = data.message?.reference || [];
    
    // Get full details for each reference that has a DOI
    const referencesWithDetails: CrossrefWork[] = [];
    
    for (const ref of references) {
      if (ref.DOI) {
        try {
          const workDetails = await getWorkByDOI(ref.DOI);
          if (workDetails) {
            referencesWithDetails.push(workDetails);
          }
        } catch (refError) {
          console.error(`Error fetching reference details for DOI ${ref.DOI}:`, refError);
        }
      }
    }
    
    return referencesWithDetails;
  } catch (error) {
    console.error("Error fetching Crossref work references:", error);
    return [];
  }
}
