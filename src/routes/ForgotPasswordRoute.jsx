import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPasswordRoute = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    console.log("Reset link sent to:", email);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "	#0d141c",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          backgroundColor: "#141f2b", 
          borderRadius: 2,
          boxShadow: 3,
          color: "white",
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center" color="#e11d48">
          Reset Password
        </Typography>

      
   <TextField
        fullWidth
        label="Email"
        name="email"
        margin="normal"
        variant="outlined"
        type="email"
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "#ccc" } }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#213547" },
            "&:hover fieldset": { borderColor: "#e11d48" },
            "&.Mui-focused fieldset": { borderColor: "#e11d48" },
          },
        }}
      />


        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
        >
          Reset Password
        </Button>

        <Typography
         onClick={() => navigate("/signin")}

          sx={{
            mt: 3,
            textAlign: "center",
            color: "#e11d48",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Back to Sign In
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPasswordRoute;
