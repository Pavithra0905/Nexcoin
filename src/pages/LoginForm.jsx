import React, { useState } from "react";
import {
  TextField,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { InputAdornment } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Lottie from "lottie-react";
import SuccessAnimation from "../assets/lottie/success.json";
import FailedAnimation from "../assets/lottie/error.json";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setOpenSuccessDialog(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); 
    } catch (error) {
      setOpenErrorDialog(true);
    }
  };
  const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user photo to context or localStorage
    localStorage.setItem("profilePhoto", user.photoURL);

    // Optional: update context if using one
    // setPhoto(user.photoURL);

    navigate("/dashboard");
  } catch (error) {
    console.error("Google Sign-In error:", error);
    setOpenErrorDialog(true);
  }
};

const EyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" stroke="#e11d48" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOffIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" stroke="#e11d48" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.965 9.965 0 012.303-3.592M9.88 9.88a3 3 0 104.24 4.24" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 00-3-3m0 0L4 4m16 16l-4.243-4.243" />
  </svg>
);

const iconButtonStyle = {
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          variant="outlined"
          type="email"
          required
          InputLabelProps={{ style: { color: "#ccc" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              backgroundColor: "#1e293b",
              "& fieldset": { borderColor: "#213547" },
              "&:hover fieldset": { borderColor: "#e11d48" },
              "&.Mui-focused fieldset": { borderColor: "#e11d48" },
            },
          }}
        />

        <TextField
  fullWidth
  label="Password"
  name="password"
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  margin="normal"
  variant="outlined"
  required
  InputProps={{
    style: { color: "white" },
    endAdornment: (
      <InputAdornment position="end">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={iconButtonStyle}
        >
          {showPassword ? EyeOffIcon : EyeIcon}
        </button>
      </InputAdornment>
    ),
  }}
  InputLabelProps={{ style: { color: "#ccc" } }}
  sx={{
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#213547" },
      "&:hover fieldset": { borderColor: "#e11d48" },
      "&.Mui-focused fieldset": { borderColor: "#e11d48" },
    },
  }}
/>


        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          <FormControlLabel
            control={<Checkbox sx={{ color: "#e11d48" }} />}
            label="Remember me"
            sx={{ color: "white" }}
          />
          <Typography
            component="span"
            onClick={() => navigate("/forgot-password")}
            sx={{
              color: "#e11d48",
              fontSize: "0.875rem",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Forgot password?
          </Typography>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="error"
          sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
        >
          Sign In
        </Button>

        <Divider
          sx={{
            my: 3,
            "&::before, &::after": {
              borderColor: "#213547",
            },
            color: "white",
          }}
        >
          OR
        </Divider>

        <Button
          fullWidth
          variant="outlined"
           onClick={handleGoogleSignIn}
          sx={{
            color: "white",
            borderColor: "#213547",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 1.5,
            textTransform: "none",
            "&:hover": {
              borderColor: "#e11d48",
              color: "#e11d48",
            },
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google logo"
            width="20"
            height="20"
            style={{ marginRight: "8px" }}
          />
          Continue with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "#213547",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 1.5,
            textTransform: "none",
            "&:hover": {
              borderColor: "#e11d48",
              color: "#e11d48",
            },
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/ffffff/mac-os.png"
            alt="Apple logo"
            width="20"
            height="20"
            style={{ marginRight: "8px" }}
          />
          Continue with Apple
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "#ccc",
          }}
        >
          Create an account?{' '}
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "#e11d48",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign up
          </span>
        </Typography>
      </form>

    
      <Dialog
        open={openSuccessDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            minWidth: 400,
            px: 2,
          },
        }}
      >
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          Login Successful!
          <IconButton onClick={() => navigate("/dashboard")} size="small">
          
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Lottie animationData={SuccessAnimation} loop={false} style={{ height: 150 }} />
          <Typography sx={{ mt: 2 }}>You have successfully logged in.</Typography>
        </DialogContent>
        <Box sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            onClick={() => navigate("/dashboard")}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            OK
          </Button>
        </Box>
      </Dialog>

    
      <Dialog
        open={openErrorDialog}
        onClose={() => setOpenErrorDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            minWidth: 500,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Login Failed
          <IconButton onClick={() => setOpenErrorDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Lottie animationData={FailedAnimation} loop={false} style={{ height: 150 }} />
          <Typography sx={{ mt: 2, color: "red" }}>
            Invalid email or password. Please try again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenErrorDialog(false)}
            color="error"
            variant="contained"
          >
            Retry
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginForm;