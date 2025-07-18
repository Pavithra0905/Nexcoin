// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth } from "../firebase";
import { updatePassword } from "firebase/auth";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggles for show/hide passwords
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("User not logged in.");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match.");
    return;
  }

  try {
    // ✅ Step 1: Create a credential using current password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    // ✅ Step 2: Re-authenticate user with that credential
    await reauthenticateWithCredential(user, credential);

    // ✅ Step 3: Now update password
    await updatePassword(user, newPassword);

    alert("✅ Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    console.error("❌ Error:", error.code, error.message);

    // Show specific error messages
    if (error.code === "auth/wrong-password") {
      alert("❌ Current password is incorrect.");
    } else if (error.code === "auth/weak-password") {
      alert("❌ New password is too weak.");
    } else if (error.code === "auth/requires-recent-login") {
      alert("⚠️ Please log out and log in again to update your password.");
    } else {
      alert("❌ Error updating password.");
    }
  }
};


  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>

      <Grid container spacing={4} direction="column">
        {/* Current Password */}
        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item sx={{ minWidth: 160 }}>
              <Typography>Current Password:</Typography>
            </Grid>
            <Grid item xs>
              <TextField
                type={showCurrent ? "text" : "password"}
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowCurrent(!showCurrent)}>
                        {showCurrent ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* New Password */}
        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item sx={{ minWidth: 160 }}>
              <Typography>New Password:</Typography>
            </Grid>
            <Grid item xs>
              <TextField
                type={showNew ? "text" : "password"}
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNew(!showNew)}>
                        {showNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Confirm Password */}
        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item sx={{ minWidth: 160 }}>
              <Typography>Re-enter Password:</Typography>
            </Grid>
            <Grid item xs>
              <TextField
                type={showConfirm ? "text" : "password"}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Update Button aligned right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleChangePassword}
          sx={{
            backgroundColor: "#0f172a",
            "&:hover": {
              backgroundColor: "#1e293b",
            },
          }}
        >
          Update Password
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
