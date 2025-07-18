import React, { useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Lottie from "lottie-react";
import ProfileAnimation from "../assets/lottie/Profile.json";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const tab = location.pathname === "/signup" ? 1 : 0;

  const handleTabChange = (e, newVal) => {
    navigate(newVal === 0 ? "/signin" : "/signup");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#64748b",
        overflow: "hidden",
        p: 0,
        m: 0,
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Paper
          sx={{
            width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
            maxWidth: "1000px",
            height: { xs: "auto", md: "90vh" },
            maxHeight: "100vh",
            overflowY: "auto",

            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            bgcolor: "#0f172a",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundImage: "url('/aaa.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 2,
              }}
            />
            <Box
              sx={{
                zIndex: 3,
                color: "white",
                textAlign: "center",
                px: 4,
                width: "80%",
              }}
            >
              <Lottie
                animationData={ProfileAnimation}
                loop
                autoplay
                style={{ width: "100%", maxWidth: 350 }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 3,
              bgcolor: "rgba(30, 41, 59, 0.6)",
              borderRadius: isSmallScreen ? 0 : 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{ color: "#e11d48", mb: 2 }}
            >
              NexCoin
            </Typography>

            <Tabs
              value={tab}
              onChange={handleTabChange}
              centered={!isSmallScreen}
              variant={isSmallScreen ? "fullWidth" : "standard"}
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#e11d48",
                  height: "3px",
                },
              }}
              textColor="inherit"
              sx={{
                mb: 3,
                borderBottom: "none",
                "& .MuiTabs-flexContainer": {
                  borderBottom: "none",
                },
                "& .MuiTab-root": {
                  color: "#ccc",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  minHeight: "unset",
                  p: "6px 16px",
                  border: "none",
                  outline: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
                "& .MuiTab-root:focus": {
                  outline: "none",
                },
                "& .Mui-selected": {
                  color: "#e11d48",
                },
              }}
            >
              <Tab label="Sign In" disableRipple />
              <Tab label="Sign Up" disableRipple />
            </Tabs>

            <Box sx={{ mt: 0 }}>
              {tab === 0 ? <LoginForm /> : <SignUpForm />}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;
