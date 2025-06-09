import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import type { SortOption } from '../interfaces/interfaces';

interface LocationType {
  city: string;
  state: string;
  zip_code?: string;
}

interface FilterControlsProps {
  breeds: string[];
  selectedBreed: string;
  onSelectBreed: (breed: string) => void;
  locations: LocationType[];
  selectedLocationZip: string;
  onSelectLocation: (zip: string) => void;
  sortOption: SortOption;
  onSelectSort: (sort: SortOption) => void;
  viewFavoritesOnly: boolean;
  onToggleViewFavorites: () => void;
  onGetMatch: () => void;
  isGetMatchDisabled: boolean;
}

const FilterControls = ({
  breeds,
  selectedBreed,
  onSelectBreed,
  locations,
  selectedLocationZip,
  onSelectLocation,
  sortOption,
  onSelectSort,
  viewFavoritesOnly,
  onToggleViewFavorites,
  onGetMatch,
  isGetMatchDisabled,
}: FilterControlsProps) => (
  <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={3}>
    <FormControl sx={{ minWidth: 200 }} size="small">
      <Select
        value={selectedBreed}
        onChange={e => onSelectBreed(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">Select Breed</MenuItem>
        {breeds.map(breed => (
          <MenuItem key={breed} value={breed}>
            {breed}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl sx={{ minWidth: 200 }} size="small">
      <Select
        value={selectedLocationZip}
        onChange={e => onSelectLocation(e.target.value)}
        displayEmpty
      >
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
      <Select
        value={sortOption}
        onChange={e => onSelectSort(e.target.value as SortOption)}
        label="Sort By"
      >
        <MenuItem value="name:asc">Name: A to Z</MenuItem>
        <MenuItem value="name:desc">Name: Z to A</MenuItem>
        <MenuItem value="breed:asc">Breed: A to Z</MenuItem>
        <MenuItem value="breed:desc">Breed: Z to A</MenuItem>
        <MenuItem value="age:asc">Age: A to Z</MenuItem>
        <MenuItem value="age:desc">Age: Z to A</MenuItem>
      </Select>
    </FormControl>

    <Button variant="outlined" onClick={onToggleViewFavorites}>
      {viewFavoritesOnly ? 'View All Dogs' : 'View Favorites'}
    </Button>

    <Button variant="contained" color="primary" onClick={onGetMatch} disabled={isGetMatchDisabled}>
      Get Match
    </Button>
  </Box>
);

export default FilterControls;
