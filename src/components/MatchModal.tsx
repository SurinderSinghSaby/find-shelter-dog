import { Box, IconButton, Paper, Typography } from '@mui/material';
import type { Dog } from '../interfaces/interfaces';
import DogCard from './DogCard';

interface MatchModalProps {
  matchedDog: Dog | null;
  open: boolean;
  onClose: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const MatchModal = ({ matchedDog, open, onClose, favorites, toggleFavorite }: MatchModalProps) => {
  if (!open || !matchedDog) return null;

  return (
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
          onClick={onClose}
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
  );
};

export default MatchModal;
