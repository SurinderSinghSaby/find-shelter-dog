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
        borderRadius: 2,
        boxShadow: isFavorite
          ? "0 0 8px 2px rgba(33, 150, 243, 0.6)"
          : "0 1px 4px rgba(0,0,0,0.1)",
        backgroundColor: isFavorite ? "#e3f2fd" : "white",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
        height: 280,
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
      elevation={isFavorite ? 8 : 1}
      aria-label={`Dog card for ${name}`}
    >
      {/* Favorite Icon */}
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <StarIcon sx={{ color: "#fbc02d" }} />
          ) : (
            <StarBorderIcon sx={{ color: "#bbb" }} />
          )}
        </IconButton>
      </Box>

      {/* Image */}
      <CardMedia
        component="img"
        image={img || "/fallback-image.jpg"}
        alt={name}
        sx={{
          height: 160,
          width: "100%",
          objectFit: "cover",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          userSelect: "none",
        }}
        draggable={false}
      />

      {/* Info */}
      <CardContent
        sx={{
          flexGrow: 1,
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 600, mb: 0.5, color: "#222" }}
          title={name}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ fontStyle: "italic" }}
          title={`${breed} — Age: ${age} — Zip: ${zip_code}`}
        >
          {breed} — {age} — {zip_code}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DogCard;
