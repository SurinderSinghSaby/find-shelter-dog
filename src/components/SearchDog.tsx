import { Favorite, FavoriteBorder } from '@mui/icons-material';
import Confetti from 'react-confetti';


import {
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Dog, Location, Match, SearchDogsParams } from '../interfaces/interfaces';
import { fetchBreeds, fetchDogsByIds, matchDogs, searchDogs } from '../services/dogsApi';
import { fetchLocations } from '../services/locationApi';
import DogCard from './DogCard';
  
  const PAGE_SIZE = 9;
  const MAX_DOG_SEARCH = 100;
  
  type SortOption = 'name-asc' | 'name-desc' | 'breed-asc' | 'breed-desc' | 'zip-asc' | 'zip-desc';
  

  const useWindowSize  = () => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
    useEffect(() => {
      function handleResize() {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowSize;
  }

  const DogSearch = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedBreed, setSelectedBreed] = useState<string>('');
    const [selectedLocationZip, setSelectedLocationZip] = useState<string>('');
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [sortOption, setSortOption] = useState<SortOption>('breed-asc');
    const [favorites, setFavorites] = useState<string[]>(() => {
      const stored = localStorage.getItem('favoriteDogs');
      return stored ? JSON.parse(stored) : [];
    });
    const [viewFavoritesOnly, setViewFavoritesOnly] = useState(false);


    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showMatchView, setShowMatchView] = useState(false);

    const { width, height } = useWindowSize();
  
    useEffect(() => {
      (async () => {
        try {
          const data = await fetchBreeds();
          setBreeds(data);
        } catch {
          console.error('Failed to load breeds');
        }
      })();
    }, []);
  
    useEffect(() => {
      localStorage.setItem('favoriteDogs', JSON.stringify(favorites));
    }, [favorites]);
  
    useEffect(() => {
        const loadLocations = async () => {
          setLoading(true);
          try {
            if (!selectedBreed) {
              setLocations([]);
              return;
            }
      
            const allResultIds: string[] = [];
            let from = 0;
            const pageSize = 100;
            let total = 0;
      
            // 1. Paginate through ALL dogs with selected breed
            do {
              const searchResult = await searchDogs({
                breeds: [selectedBreed],
                from,
                size: pageSize,
              });
      
              if (searchResult.resultIds.length === 0) break;
      
              allResultIds.push(...searchResult.resultIds);
              total = searchResult.total || allResultIds.length;
              from += pageSize;
            } while (from < total);
      
            // 2. Fetch dogs in batches of 100
            const chunks: string[][] = [];
            for (let i = 0; i < allResultIds.length; i += 100) {
              chunks.push(allResultIds.slice(i, i + 100));
            }
      
            const allDogsArrays = await Promise.all(chunks.map(fetchDogsByIds));
            const allDogs = allDogsArrays.flat();
      
            // 3. Get unique zip codes
            const uniqueZips = Array.from(new Set(
              allDogs
                .map(dog => dog.zip_code)
                .filter((zip): zip is string => typeof zip === 'string' && zip.trim() !== '')
            ));
      
            // 4. Fetch location info using those zips
            const locationChunks: string[][] = [];
            for (let i = 0; i < uniqueZips.length; i += 100) {
              locationChunks.push(uniqueZips.slice(i, i + 100));
            }
      
            const locationResultsArrays = await Promise.all(
              locationChunks.map(chunk => fetchLocations(chunk))
            );
      
            const allLocations = locationResultsArrays.flat();
      
            // 5. Remove invalid and sort by city
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
      
  
    useEffect(() => {
      const fetchDogsData = async () => {
        setLoading(true);
        try {
          const searchParams: SearchDogsParams = {
            breeds: selectedBreed ? [selectedBreed] : undefined,
            zipCodes: selectedLocationZip ? [selectedLocationZip] : undefined,
            size: PAGE_SIZE,
            from: (page - 1) * PAGE_SIZE,
          };
          const searchResult = await searchDogs(searchParams);

          
          setTotalResults(searchResult.total || 0);
          if (searchResult.resultIds.length > 0) {
            let dogDetails = await fetchDogsByIds(searchResult.resultIds);
            dogDetails = dogDetails.sort((a, b) => {
                console.log(sortOption)
              switch (sortOption) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'breed-asc': return a.breed.localeCompare(b.breed);
                case 'breed-desc': return b.breed.localeCompare(a.breed);
                default: return 0;
              }
            });
          
            setDogs(dogDetails);
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
  
    const toggleFavorite = (dogId: string) => {
      setFavorites(prev => prev.includes(dogId) ? prev.filter(id => id !== dogId) : [...prev, dogId]);
    };
  
    const handleMatch = async () => {
      if (favorites.length === 0) return;
      try {
        const matchResponse: Match = await matchDogs(favorites); // this returns { match: "dog_id" }
        const matchedDogId = matchResponse.match;


        const matchedDogD = await fetchDogsByIds([matchedDogId]);
   
        if (matchedDogD.length > 0) {
            setMatchedDog(matchedDogD[0]);
            setShowCelebration(true);
      
            // After 3 seconds, stop celebration & show matched dog view
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
  
          <Button variant="contained" color="primary" onClick={handleMatch} disabled={favorites.length === 0}>
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
                <Grid key={dog.id} item xs={12} sm={6} md={4} lg={3}>
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