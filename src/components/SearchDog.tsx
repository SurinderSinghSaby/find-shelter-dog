import { Favorite, FavoriteBorder } from '@mui/icons-material';
import Confetti from 'react-confetti';

import Grid from '@mui/material/Grid';

import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import DogCard from './DogCard';

import useBreeds from '../hooks/useBreeds';
import useDogs from '../hooks/useDogs';
import useLocations from '../hooks/useLocations';
import useMatch from '../hooks/useMatch';
import useWindowSize from '../hooks/useWindows';
  
  const PAGE_SIZE = 9;

  
  type SortOption = 'name-asc' | 'name-desc' | 'breed-asc' | 'breed-desc';
  

  const DogSearch = () => {
    const breeds = useBreeds();
    const [selectedBreed, setSelectedBreed] = useState<string>('');
    const { locations } = useLocations(selectedBreed);
    const [selectedLocationZip, setSelectedLocationZip] = useState<string>('');
    const [page, setPage] = useState(1);
    const [sortOption, setSortOption] = useState<SortOption>('breed-asc');
    const { dogs, totalResults, loading } = useDogs(selectedBreed, selectedLocationZip, page, sortOption);
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
      setShowMatchView
    } = useMatch();

    const { width, height } = useWindowSize();
  
  
    useEffect(() => {
      localStorage.setItem('favoriteDogs', JSON.stringify(favorites));
    }, [favorites]);
     
  
    const toggleFavorite = (dogId: string) => {
      setFavorites(prev => prev.includes(dogId) ? prev.filter(id => id !== dogId) : [...prev, dogId]);
    };
  

    const displayedDogs = viewFavoritesOnly
    ? dogs.filter(d => favorites.includes(d.id))
    : dogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Your Perfect Dog
        </Typography>
  
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={3}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select value={selectedBreed} onChange={e => { setSelectedBreed(e.target.value); setSelectedLocationZip(''); setDogs([]); setPage(1); }} displayEmpty>
              <MenuItem value="">Select Breed</MenuItem>
              {breeds.map(breed => <MenuItem key={breed} value={breed}>{breed}</MenuItem>)}
            </Select>
          </FormControl>
  
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select value={selectedLocationZip} onChange={e => { setSelectedLocationZip(e.target.value); setPage(1); }} displayEmpty>
              <MenuItem value="">Select Location</MenuItem>
              {locations.map((loc, i) => (
                <MenuItem key={loc.zip_code || `loc-${i}`} value={loc.zip_code || ''}>
                  {loc.city}, {loc.state} ({loc.zip_code || 'N/A'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)} label="Sort By">
              <MenuItem value="name-asc">Name: A to Z</MenuItem>
              <MenuItem value="name-desc">Name: Z to A</MenuItem>
              <MenuItem value="breed-asc">Breed: A to Z</MenuItem>
              <MenuItem value="breed-desc">Breed: Z to A</MenuItem>
            </Select>
          </FormControl>
  
          <Button variant="outlined" onClick={() => setViewFavoritesOnly(v => !v)}>
            {viewFavoritesOnly ? 'View All Dogs' : 'View Favorites'}
          </Button>
  
          <Button variant="contained" color="primary" onClick={() => handleMatch(favorites)} disabled={favorites.length === 0}>
            Get Match
          </Button>
        </Box>
  
        {showCelebration && (
  <>
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        bgcolor: 'rgba(0,0,0,0.5)',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
      }}
    >
      🎉 Congratulations! You found a match! 🎉
      <Confetti width={width} height={height} numberOfPieces={500} />
    </Box>
  </>
)}

{showMatchView && matchedDog && (
  <Box
    sx={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      bgcolor: 'rgba(0,0,0,0.7)',
      zIndex: 1400,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
    }}
  >
    <Paper sx={{ maxWidth: 400, p: 3, position: 'relative' }} elevation={12}>
      <IconButton
        onClick={() => setShowMatchView(false)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
        aria-label="Close matched dog"
      >
        ✕
      </IconButton>
      <Typography variant="h5" mb={2} textAlign="center">
        Your Perfect Match!
      </Typography>
      <DogCard
        {...matchedDog}
        isFavorite={favorites.includes(matchedDog.id)}
        onToggleFavorite={() => toggleFavorite(matchedDog.id)}
      />
    </Paper>
  </Box>
)}


        {loading ? (
          <Box textAlign="center" my={6}><CircularProgress /></Box>
        ) : displayedDogs.length > 0 ? (
          < >
            <Grid container spacing={3} justifyContent="center">
              {displayedDogs.map(dog => (
                <Grid key={dog.id} size={{ xs: 12, sm: 6, md: 4, lg:3}}>
                  <Paper elevation={3} sx={{ p: 2, position: 'relative' }}>
                    <DogCard {...dog} isFavorite={favorites.includes(dog.id)} onToggleFavorite={() => toggleFavorite(dog.id)} />
                    <IconButton
                      onClick={() => toggleFavorite(dog.id)}
                      sx={{ position: 'absolute', top: 8, left: 8 }}
                      color={favorites.includes(dog.id) ? 'primary' : 'default'}
                    >
                      {favorites.includes(dog.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
  
            <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={2}>
              <Button variant="outlined" disabled={page <= 1 || loading} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</Button>
              <Typography>Page {page} of {totalPages || 1}</Typography>
              <Button variant="outlined" disabled={page >= totalPages || loading} onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>Next</Button>
            </Box>
          </>
        ) : (
          <Typography variant="body1" mt={6} textAlign="center">No dogs found for this criteria.</Typography>
        )}
  
        {/*{matchDog && (
          <Box mt={4}>
            <Typography variant="h6">Matched Dog</Typography>
            <Box mt={2}>
              <DogCard {...matchDog} isFavorite={favorites.includes(matchDog.id)} onToggleFavorite={() => toggleFavorite(matchDog.id)} />
            </Box>
          </Box>
        )}*/}
      </Container>
    );
  };
  
  export default DogSearch;