import {api} from "./api"
import type { Dog, Match } from '../interfaces/interfaces'; 


// Fetch all breed names
export const fetchBreeds = async (): Promise<string[]> => {
    const response = await api.get<string[]>('/dogs/breeds');
    return response.data;
  };
  
  // Search dogs based on filters
  interface SearchDogsParams {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: string; // e.g., 'breed:asc'
  }
  
  interface SearchDogsResponse {
    resultIds: string[];
    total: number;
    next?: string;
    prev?: string;
  }


  // Max can be 10000
  export const searchDogs = async (params: SearchDogsParams): Promise<SearchDogsResponse> => {
    const response = await api.get<SearchDogsResponse>('/dogs/search', { params });
    return response.data;
  };
  
  // Fetch dog details by IDs (max 100)
  export const fetchDogsByIds = async (dogIds: string[]): Promise<Dog[]> => {
    const response = await api.post<Dog[]>('/dogs', dogIds);
    return response.data;
  };
  
  // Match the user with a dog
  export const matchDogs = async (dogIds: string[]): Promise<Match>  => {
    const response = await api.post<Match>('/dogs/match', dogIds);
    return response.data;
  };

  export const searchDogsByUrl = async (url: string): Promise<SearchDogsResponse> => {
    // url might be like "/dogs/search?from=5&size=5&breeds=...".
    // Just call api.get(url) directly.
    const response = await api.get<SearchDogsResponse>(url);
    return response.data;
  };
  
  