import { useEffect, useState } from 'react';
import { fetchBreeds } from '../services/dogsApi';

const useBreeds = () => {
  const [breeds, setBreeds] = useState<string[]>([]);

  useEffect(() => {
    fetchBreeds().then(setBreeds).catch(() => console.error('Failed to load breeds'));
  }, []);

  return breeds;
};

export default useBreeds;
