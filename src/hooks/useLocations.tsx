import { useEffect, useState } from 'react';
import { fetchDogsByIds, searchDogs } from '../services/dogsApi';
import { fetchLocations } from '../services/locationApi';
import type { Location } from '../interfaces/interfaces';

const useLocations = (selectedBreed: string) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLocations = async () => {
      if (!selectedBreed) return setLocations([]);
      setLoading(true);
      try {
        const allResultIds: string[] = [];
        let from = 0, total = 0, pageSize = 100;

        do {
          const res = await searchDogs({ breeds: [selectedBreed], from, size: pageSize });
          if (!res.resultIds.length) break;
          allResultIds.push(...res.resultIds);
          total = res.total || allResultIds.length;
          from += pageSize;
        } while (from < total);

        const allDogs = (await Promise.all(
          Array.from({ length: Math.ceil(allResultIds.length / 100) }, (_, i) =>
            fetchDogsByIds(allResultIds.slice(i * 100, i * 100 + 100))
          )
        )).flat();

        const uniqueZips = Array.from(new Set(allDogs.map(d => d.zip_code).filter(Boolean)));

        const allLocations = (await Promise.all(
          Array.from({ length: Math.ceil(uniqueZips.length / 100) }, (_, i) =>
            fetchLocations(uniqueZips.slice(i * 100, i * 100 + 100))
          )
        )).flat();

        const sortedLocations = allLocations
          .filter(loc => loc && loc.zip_code && loc.city)
          .sort((a, b) => a.city.localeCompare(b.city));

        setLocations(sortedLocations);
      } catch (err) {
        console.error('Failed to load locations', err);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [selectedBreed]);

  return { locations, loading };
};

export default useLocations;
