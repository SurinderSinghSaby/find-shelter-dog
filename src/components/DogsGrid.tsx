import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Grid, IconButton, Paper } from '@mui/material';
import type { Dog } from '../interfaces/interfaces';
import DogCard from './DogCard';

interface DogsGridProps {
  dogs: Dog[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const DogsGrid = ({ dogs, favorites, toggleFavorite }: DogsGridProps) => (
  <Grid container spacing={3} justifyContent="center">
    {dogs.map(dog => (
      <Grid 
      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
      key={dog.id}
        >
        <Paper elevation={3} sx={{ p: 2, position: 'relative' }}>
          <DogCard
            {...dog}
            isFavorite={favorites.includes(dog.id)}
            onToggleFavorite={() => toggleFavorite(dog.id)}
          />
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
);

export default DogsGrid;
