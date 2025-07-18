import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import Lottie from "lottie-react";
import SuccessAnimation from "../assets/lottie/success.json";
import FailedAnimation from "../assets/lottie/error.json";
import { Radio, RadioGroup, FormLabel } from "@mui/material";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false)


  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!fullName.trim()) {
    alert("Please enter your full name.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // 👉 Show terms dialog before actually signing up
  setShowTermsDialog(true);
};
const handleAcceptTermsAndSignUp = async () => {
  setShowTermsDialog(false); // close the terms dialog
  setIsSubmitting(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullName,
      email,
      createdAt: new Date(),
    });

    setOpenSuccessDialog(true);
    setTimeout(() => navigate("/dashboard"), 2000);
  } catch (err) {
    console.error("Registration error:", err);
    setOpenErrorDialog(true);
  } finally {
    setIsSubmitting(false);
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}
          margin="normal" variant="outlined" required sx={textFieldStyle}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#ccc" } }}
        />
        <TextField
          fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          margin="normal" variant="outlined" required sx={textFieldStyle}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#ccc" } }}
        />
        
        <TextField
          fullWidth label="Password" type={showPassword ? "text" : "password"} value={password}
          onChange={(e) => setPassword(e.target.value)} margin="normal" variant="outlined" required sx={textFieldStyle}
          InputProps={{
            style: { color: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={iconButtonStyle}>
                  {showPassword ? EyeOffIcon : EyeIcon}
                </button>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: "#ccc" } }}
        />
        <TextField
          fullWidth label="Confirm Password" type={showConfirm ? "text" : "password"} value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} margin="normal" variant="outlined" required sx={textFieldStyle}
          InputProps={{
            style: { color: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={iconButtonStyle}>
                  {showConfirm ? EyeOffIcon : EyeIcon}
                </button>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ style: { color: "#ccc" } }}
        />
        <FormControlLabel
          control={<Checkbox sx={{ color: "#e11d48" }} required />}
          label="I agree to the Terms & Conditions"
          sx={{ color: "white", mt: 1 }}
        />
        <Button
          fullWidth variant="contained" color="error" type="submit"
          disabled={isSubmitting} sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "#ccc" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/signin")} style={{ color: "#e11d48", cursor: "pointer", fontWeight: "bold" }}>
            Sign In
          </span>
        </Typography>
      </form>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} PaperProps={{ sx: { borderRadius: 4, minWidth: 400, px: 2 } }}>
        <DialogTitle>Registered Successfully!</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Lottie animationData={SuccessAnimation} loop={false} style={{ height: 150 }} />
          <Typography sx={{ mt: 2 }}>You have registered successfully.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => navigate("/dashboard")} color="error" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} PaperProps={{ sx: { borderRadius: 4, minWidth: 400 } }}>
        <DialogTitle>
          Registration failed!
          <IconButton onClick={() => setOpenErrorDialog(false)} size="small" sx={{ float: "right" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Lottie animationData={FailedAnimation} loop={false} style={{ height: 150 }} />
          <Typography sx={{ mt: 2, color: "red" }}>Something went wrong. Please try again!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)} color="error" variant="contained">Retry</Button>
        </DialogActions>
      </Dialog>
     <Dialog open={showTermsDialog} onClose={() => setShowTermsDialog(false)} PaperProps={{ sx: { borderRadius: 4, minWidth: 500 } }}>
  <DialogTitle>Terms & Conditions</DialogTitle>

  {/* Heading OUTSIDE scrollable area */}
  <Typography variant="body2" sx={{ fontSize: "0.9rem", px: 3, pt: 1 }}>
    Welcome to our platform! Please carefully review the following terms before using our services:
  </Typography>

  {/* Scrollable content */}
  <DialogContent sx={{ maxHeight: 300, overflowY: "auto", mt: 1 }}>
    <ol style={{ paddingLeft: "1.2rem", margin: 0, color: "#444", fontSize: "0.9rem" }}>
      <li style={{ marginBottom: "0.75rem" }}>
        <strong>Acceptance of Terms:</strong> By creating an account, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not register.
      </li>
      <li style={{ marginBottom: "0.75rem" }}>
        <strong>User Responsibilities:</strong> You agree not to misuse the platform, upload harmful content, or engage in any activity that could damage our infrastructure or reputation.
      </li>
      <li style={{ marginBottom: "0.75rem" }}>
        <strong>Data Usage:</strong> We collect and store personal data (name, email, preferences) to improve your experience. We do not sell your data.
      </li>
      <li style={{ marginBottom: "0.75rem" }}>
        <strong>Security:</strong> You are responsible for maintaining the confidentiality of your login credentials. We are not liable for unauthorized access due to your negligence.
      </li>
      <li style={{ marginBottom: "0.75rem" }}>
        <strong>Service Availability:</strong> Our services may occasionally be unavailable due to maintenance or outages. We strive to notify users in advance.
      </li>
      <li style={{ marginBottom: "0.75rem" }}>
        <strong>Account Termination:</strong> We may suspend or terminate accounts that violate our terms without prior notice.
      </li>
      <li style={{ marginBottom: "0.75rem" }}>
        <strong>Modifications:</strong> These terms may be updated. Continued use indicates your acceptance of the revised terms.
      </li>
      <li style={{ marginBottom: "0.75rem" }}>
        <strong>Contact:</strong> For support, reach out to <a href="mailto:support@nexcoin.com">support@nexcoin.com</a>.
      </li>
    </ol>

    <Typography variant="body2" sx={{ mt: 2 }}>
      By clicking "Accept", you acknowledge that you have read, understood, and agree to these terms and our Privacy Policy.
    </Typography>

    
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => {
        setShowTermsDialog(false);
        setTermsChecked(false);
      }}
      variant="outlined"
      color="inherit"
    >
      Dismiss
    </Button>
    <Button
      onClick={handleAcceptTermsAndSignUp}
      variant="contained"
      color="error"
      
    >
      Accept
    </Button>
  </DialogActions>
</Dialog>



    
  



    </>
  );
};

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1e293b",
    "& fieldset": { borderColor: "#213547" },
    "&:hover fieldset": { borderColor: "#e11d48" },
    "&.Mui-focused fieldset": { borderColor: "#e11d48" },
  },
};

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

export default SignUpForm;
