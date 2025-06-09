import { useState } from 'react';
import { fetchDogsByIds, matchDogs } from '../services/dogsApi';
import type { Dog, Match } from '../interfaces/interfaces';

const useMatch = () => {
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMatchView, setShowMatchView] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMatch = async (favorites: string[]) => {
    if (favorites.length === 0) return;
    setLoading(true);
    try {
      const matchResponse: Match = await matchDogs(favorites); // { match: "dog_id" }
      const matchedDogId = matchResponse.match;

      const matchedDogArr = await fetchDogsByIds([matchedDogId]);

      if (matchedDogArr.length > 0) {
        setMatchedDog(matchedDogArr[0]);
        setShowCelebration(true);

        setTimeout(() => {
          setShowCelebration(false);
          setShowMatchView(true);
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to match dog', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    matchedDog,
    showCelebration,
    showMatchView,
    loading,
    handleMatch,
    setShowMatchView,
  };
};

export default useMatch;
