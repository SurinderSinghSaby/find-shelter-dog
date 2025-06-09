
import { useForm } from "react-hook-form";

import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { login } from "../services/loginApi";

type FormData = {
    name: string,
    email: string
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({});
  const navigate = useNavigate();
  const onSubmit = async (data: FormData) => {

    console.log("Login attempt:", data);
    try {
        const response = await login(data.name, data.email);
        console.log("Login successful:", response.data);
        navigate("/search");
        // Handle successful login (e.g., redirect or save session)
      } catch (error) {
        console.error("Login failed:", error);
        // Handle errors (e.g., show a message to the user)
      }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign In
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 2 }}
        >
          <TextField
            fullWidth
            label="name"
            variant="outlined"
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            label="email"
            type="email"
            variant="outlined"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginForm;
