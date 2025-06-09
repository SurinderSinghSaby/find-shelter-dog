import { Box } from '@mui/material';
import Confetti from 'react-confetti';

interface CelebrationOverlayProps {
  width: number;
  height: number;
}

const CelebrationOverlay = ({ width, height }: CelebrationOverlayProps) => (
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
);

export default CelebrationOverlay;
