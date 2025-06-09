import { useEffect, useState } from 'react';
import type { Dog, SearchDogsParams, SortOption } from '../interfaces/interfaces';
import { fetchDogsByIds, searchDogs } from '../services/dogsApi';


const useDogs = (
  selectedBreed: string,
  selectedLocationZip: string,
  page: number,
  sortOption: SortOption,
  pageSize = 8,

) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  console.log(selectedBreed)
  useEffect(() => {
    const fetchDogsData = async () => {
      setLoading(true);
      console.log(selectedBreed)
      
      try {
        const params: SearchDogsParams = {
          breeds: selectedBreed ? [selectedBreed] : undefined,
          zipCodes: selectedLocationZip ? [selectedLocationZip] : undefined,
          size: pageSize,
          from: (page - 1) * pageSize,
          sort: sortOption
        };
        
        console.log(params)
        const result = await searchDogs(params);
        setTotalResults(result.total || 0);

        if (result.resultIds.length > 0) {
          let details = await fetchDogsByIds(result.resultIds);
          setDogs(details);
        } else {
          setDogs([]);
        }
      } catch (err) {
        console.error('Search failed', err);
        setDogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDogsData();
  }, [selectedBreed, selectedLocationZip, page, sortOption]);

  return { dogs, totalResults, loading };
};

export default useDogs;
