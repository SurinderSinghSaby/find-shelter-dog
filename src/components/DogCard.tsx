import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import type { Dog } from "../interfaces/interfaces";

interface Props extends Dog {
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const DogCard = ({
  name,
  breed,
  age,
  zip_code,
  img,
  isFavorite = false,
  onToggleFavorite,
}: Props) => {
  return (
    <Card
      onClick={onToggleFavorite}
      sx={{
        position: "relative",
        border: isFavorite ? "2px solid #2196f3" : "1px solid #ccc",
        backgroundColor: isFavorite ? "#e3f2fd" : "white",
        height: 250, // Fixed height
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Favorite Icon */}
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
        >
          {isFavorite ? (
            <StarIcon sx={{ color: "#fbc02d" }} />
          ) : (
            <StarBorderIcon sx={{ color: "#ccc" }} />
          )}
        </IconButton>
      </Box>

      {/* Image */}
      <Box sx={{ height: 180, width: 250}}>
        <CardMedia
          component="img"
          image={img || "/fallback-image.jpg"}
          alt={name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Crop image
          }}
        />
      </Box>

      {/* Info */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {breed} — {age} — {zip_code}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DogCard;
