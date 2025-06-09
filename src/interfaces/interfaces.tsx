export interface Dog {
    id: string;
    name: string;
    breed: string;
    age: number;
    zip_code: string;
    img: string;
  }
  
export interface Location {
    zip_code: string
    latitude: number
    longitude: number
    city: string
    state: string
    county: string
}

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface SearchDogsParams {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: string; // e.g., "breed:asc", "age:desc"
  }

export interface Match{
    match: string;
}

export type SortOption = 'name:asc' | 'name:desc' | 'breed:asc' | 'breed:desc' | 'age:asc' | 'age:desc';
  