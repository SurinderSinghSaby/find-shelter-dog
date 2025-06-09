import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { SortOption } from '../interfaces/interfaces';

import CelebrationOverlay from './CelebrationOverlay';
import DogsGrid from './DogsGrid';
import FilterControls from './FilterControls';
import MatchModal from './MatchModal';
import PaginationControls from './PaginationControls';

import useBreeds from '../hooks/useBreeds';
import useDogs from '../hooks/useDogs';
import useLocations from '../hooks/useLocations';
import useMatch from '../hooks/useMatch';
import useWindowSize from '../hooks/useWindows';

const PAGE_SIZE = 8;


const DogSearch = () => {
  const breeds = useBreeds();
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const { locations } = useLocations(selectedBreed);
  const [selectedLocationZip, setSelectedLocationZip] = useState<string>('');
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>('breed:asc');

  const { dogs, totalResults, loading } = useDogs(selectedBreed, selectedLocationZip, page, sortOption, PAGE_SIZE, breeds);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favoriteDogs');
    return stored ? JSON.parse(stored) : [];
  });
  const [viewFavoritesOnly, setViewFavoritesOnly] = useState(false);

  const {
    matchedDog,
    showCelebration,
    showMatchView,
    handleMatch,
    setShowMatchView,
  } = useMatch();

  const { width, height } = useWindowSize();

  useEffect(() => {
    localStorage.setItem('favoriteDogs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (dogId: string) => {
    setFavorites(prev =>
      prev.includes(dogId) ? prev.filter(id => id !== dogId) : [...prev, dogId]
    );
  };

  const displayedDogs = viewFavoritesOnly
    ? dogs.filter(d => favorites.includes(d.id))
    : dogs;

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  // Handlers for FilterControls
  const handleSelectBreed = (breed: string) => {
    setSelectedBreed(breed);
    setSelectedLocationZip('');
    setPage(1);
  };

  const handleSelectLocation = (zip: string) => {
    setSelectedLocationZip(zip);
    setPage(1);
  };

  const handleSelectSort = (sort: SortOption) => {
    setSortOption(sort);
  };

  const handleToggleViewFavorites = () => {
    setViewFavoritesOnly(v => !v);
  };

  const handleGetMatch = () => {
    handleMatch(favorites);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 0, mt: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, mt: 0 }}>
        Find Your Perfect Dog
      </Typography>

      <FilterControls
        breeds={breeds}
        selectedBreed={selectedBreed}
        onSelectBreed={handleSelectBreed}
        locations={locations}
        selectedLocationZip={selectedLocationZip}
        onSelectLocation={handleSelectLocation}
        sortOption={sortOption}
        onSelectSort={handleSelectSort}
        viewFavoritesOnly={viewFavoritesOnly}
        onToggleViewFavorites={handleToggleViewFavorites}
        onGetMatch={handleGetMatch}
        isGetMatchDisabled={favorites.length === 0}
      />

      {showCelebration && <CelebrationOverlay width={width} height={height} />}

      <MatchModal
        matchedDog={matchedDog}
        open={showMatchView}
        onClose={() => setShowMatchView(false)}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      {loading ? (
        <Box textAlign="center" my={6}>
          <CircularProgress />
        </Box>
      ) : displayedDogs.length > 0 ? (
        <>
          <DogsGrid dogs={displayedDogs} favorites={favorites} toggleFavorite={toggleFavorite} />

          <PaginationControls
            page={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <Typography variant="body1" mt={6} textAlign="center">
          No dogs found for this criteria.
        </Typography>
      )}
    </Container>
  );
};

export default DogSearch;
