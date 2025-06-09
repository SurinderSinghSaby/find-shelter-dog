import { useEffect, useState } from 'react';
import { fetchDogsByIds, searchDogs } from '../services/dogsApi';
import type { Dog, SearchDogsParams } from '../interfaces/interfaces';

type SortOption = 'name-asc' | 'name-desc' | 'breed-asc' | 'breed-desc';

const useDogs = (
  selectedBreed: string,
  selectedLocationZip: string,
  page: number,
  sortOption: SortOption,
  pageSize = 9
) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDogsData = async () => {
      setLoading(true);
      try {
        const params: SearchDogsParams = {
          breeds: selectedBreed ? [selectedBreed] : undefined,
          zipCodes: selectedLocationZip ? [selectedLocationZip] : undefined,
          size: pageSize,
          from: (page - 1) * pageSize,
        };
        const result = await searchDogs(params);
        setTotalResults(result.total || 0);

        if (result.resultIds.length > 0) {
          let details = await fetchDogsByIds(result.resultIds);
          details = details.sort((a, b) => {
            switch (sortOption) {
              case 'name-asc': return a.name.localeCompare(b.name);
              case 'name-desc': return b.name.localeCompare(a.name);
              case 'breed-asc': return a.breed.localeCompare(b.breed);
              case 'breed-desc': return b.breed.localeCompare(a.breed);
              default: return 0;
            }
          });
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
