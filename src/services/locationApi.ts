import {api} from "./api"
import type { Location } from '../interfaces/interfaces'; 


// Fetch location info for a list of ZIP codes
export const fetchLocations = async (zipCodes: string[]): Promise<Location[]> => {
    const response = await api.post<Location[]>('/locations', zipCodes);
    return response.data;
  };
  
  // Search for locations based on city, state, bounding box, etc.
  interface GeoBoundingBox {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: { lat: number; lon: number };
    top_right?: { lat: number; lon: number };
  }
  
  interface SearchLocationParams {
    city?: string;
    states?: string[];
    geoBoundingBox?: GeoBoundingBox;
    size?: number;
    from?: number;
  }
  
  interface SearchLocationResponse {
    results: Location[];
    total: number;
  }
  
  export const searchLocations = async (params: SearchLocationParams): Promise<SearchLocationResponse> => {
    const response = await api.post<SearchLocationResponse>('/locations/search', params);
    return response.data;
  };
  