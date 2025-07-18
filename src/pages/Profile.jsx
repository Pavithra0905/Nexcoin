import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Avatar,
  Select,
  MenuItem,
  Button,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged, deleteUser } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaCamera } from "react-icons/fa";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [editedProfile, setEditedProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const fileInputRef = useRef();

  const { photo, setPhoto } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const safeData = {
            fullName: data.fullName || "",
            gender: data.gender || "",
            language: data.language || "",
            nickName: data.nickName || "",
            country: data.country || "",
            timeZone: data.timeZone || "",
            photoURL: data.photoURL || "",
          };
          setProfile(safeData);
          setEditedProfile(safeData);

          // Load user-specific image from localStorage
          const storedImage = localStorage.getItem(`profileImage-${currentUser.uid}`);
          if (storedImage) {
            setPhoto(storedImage);
          } else {
            setPhoto(safeData.photoURL || "");
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, editedProfile, { merge: true });

      const updatedSnap = await getDoc(userRef);
      if (updatedSnap.exists()) {
        const updatedData = updatedSnap.data();
        setProfile(updatedData);
        setEditedProfile(updatedData);
        setPhoto(updatedData.photoURL || "");
      }

      setEditMode(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      setPhoto(base64Data);
      localStorage.setItem(`profileImage-${user.uid}`, base64Data);
    };
    reader.readAsDataURL(file);

    const storageRef = ref(storage, `avatars/${user.uid}`);
    setUploading(true);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: downloadURL },
        { merge: true }
      );
      setProfile((prev) => ({ ...prev, photoURL: downloadURL }));
      setEditedProfile((prev) => ({ ...prev, photoURL: downloadURL }));
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: "" },
        { merge: true }
      );
      setProfile((prev) => ({ ...prev, photoURL: "" }));
      setEditedProfile((prev) => ({ ...prev, photoURL: "" }));
      setPhoto("");
      localStorage.removeItem(`profileImage-${user.uid}`);
    } catch (err) {
      console.error("Failed to remove photo:", err);
      alert("Failed to remove photo.");
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      if (!user) {
        alert("No user logged in.");
        return;
      }
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      alert("Your account has been deactivated.");
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error during account deactivation:", error);
      if (error.code === "auth/requires-recent-login") {
        alert("Please sign in again to deactivate your account.");
      } else {
        alert("Failed to deactivate account.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, width: 1200 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ position: "relative", width: 100, height: 100 }}>
          <Avatar
            src={photo || ""}
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#e2e8f0",
              cursor: "pointer",
            }}
            onClick={() => setPhotoDialogOpen(true)}
          />
          <Box
            component={Button}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#0c0731ff",
              color: "#fff",
              minWidth: 0,
              padding: "6px",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "#07052a" },
            }}
            onClick={() => setPhotoDialogOpen(true)}
          >
            <FaCamera size={16} />
          </Box>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" fontWeight="bold">
            {profile.fullName || "Your Name"}
          </Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
        >
          {editMode ? "Save" : "Edit"}
        </Button>
      </Box>

      <Dialog open={photoDialogOpen} onClose={() => setPhotoDialogOpen(false)}>
        <DialogTitle>Profile Photo</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              fileInputRef.current.click();
              setPhotoDialogOpen(false);
            }}
            sx={{ mb: 2 }}
          >
            Upload Photo
          </Button>
          {photo && (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => {
                handleRemovePhoto();
                setPhotoDialogOpen(false);
              }}
            >
              Remove Photo
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ mb: 1, width: 400 }}>Full Name</Typography>
          <TextField
            fullWidth
            value={editedProfile.fullName}
            disabled={!editMode}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
          <Typography sx={{ mt: 3, mb: 1 }}>Gender</Typography>
          <FormControl fullWidth disabled={!editMode}>
            <Select
              value={editedProfile.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ mt: 3, mb: 1 }}>Language</Typography>
          <TextField
            fullWidth
            value={editedProfile.language}
            disabled={!editMode}
            onChange={(e) => handleChange("language", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ mb: 1, width: 400 }}>Nick Name</Typography>
          <TextField
            fullWidth
            value={editedProfile.nickName}
            disabled={!editMode}
            onChange={(e) => handleChange("nickName", e.target.value)}
          />
          <Typography sx={{ mt: 3, mb: 1 }}>Country</Typography>
          <FormControl fullWidth disabled={!editMode}>
            <Select
              value={editedProfile.country}
              onChange={(e) => handleChange("country", e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Country</MenuItem>
              <MenuItem value="India">India</MenuItem>
              <MenuItem value="USA">USA</MenuItem>
              <MenuItem value="UK">UK</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ mt: 3, mb: 1 }}>Time Zone</Typography>
          <FormControl fullWidth disabled={!editMode}>
            <Select
              value={editedProfile.timeZone}
              onChange={(e) => handleChange("timeZone", e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Time Zone</MenuItem>
              <MenuItem value="IST">IST</MenuItem>
              <MenuItem value="EST">EST</MenuItem>
              <MenuItem value="PST">PST</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography fontWeight="bold" sx={{ mb: 2 }}>
          My email Address
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{ width: 24, height: 24, bgcolor: "#3b82f6", fontSize: 14 }}
          >
            📧
          </Avatar>
          <Box>
            <Typography>{user?.email}</Typography>
            <Typography color="text.secondary" fontSize={13}>
              1 month ago
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmDialogOpen(true)}
        >
          Deactivate Account
        </Button>
      </Box>

      {confirmDialogOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 4,
              borderRadius: 2,
              textAlign: "center",
              width: 300,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Confirm Deactivation
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to deactivate your account?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeactivateAccount}
              >
                Deactivate
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
