import { Box, Button, Typography } from '@mui/material';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({ page, totalPages, loading, onPageChange }: PaginationControlsProps) => (
  <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={2}>
    <Button variant="outlined" disabled={page <= 1 || loading} onClick={() => onPageChange(page - 1)}>
      Previous
    </Button>
    <Typography>
      Page {page} of {totalPages || 1}
    </Typography>
    <Button variant="outlined" disabled={page >= totalPages || loading} onClick={() => onPageChange(page + 1)}>
      Next
    </Button>
  </Box>
);

export default PaginationControls;
