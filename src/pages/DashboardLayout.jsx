import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Avatar,
  MenuItem,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import Popper from "@mui/material/Popper";
import packageJson from "../../package.json";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { UserContext } from "../context/UserContext";

import TaskTable from "../components/TaskTable";
import Dashboard from "./Dashboard";
import ChangePassword from "./ChangePassword";
import Profile from "./Profile";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const drawerWidth = 240;

const Sidebar = ({ user, mobileOpen, handleDrawerToggle, avatarImage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
          NexCoin
        </Typography>
        <List>
          <ListItem button onClick={() => navigate("/dashboard")}>
            <ListItemIcon sx={{ color: "white", cursor: "pointer" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ fontSize: "14px" }}
              sx={{ color: "white", cursor: "pointer" }}
            />
          </ListItem>

          <ListItem button onClick={() => navigate("/dashboard/mytasks")}>
            <ListItemIcon sx={{ color: "white", cursor: "pointer" }}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              primary="My Tasks"
              primaryTypographyProps={{ fontSize: "14px" }}
              sx={{ color: "white", cursor: "pointer" }}
            />
          </ListItem>

          <ListItem button onClick={() => navigate("/dashboard/tasks/pending")}>
            <ListItemIcon sx={{ color: "white", cursor: "pointer" }}>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Pending Tasks"
              primaryTypographyProps={{ fontSize: "14px" }}
              sx={{ color: "white", cursor: "pointer" }}
            />
          </ListItem>

          <ListItem
            button
            onClick={() => navigate("/dashboard/tasks/completed")}
          >
            <ListItemIcon sx={{ color: "white", cursor: "pointer" }}>
              <CheckCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Completed Tasks"
              primaryTypographyProps={{ fontSize: "14px" }}
              sx={{ color: "white", cursor: "pointer" }}
            />
          </ListItem>
        </List>
      </Box>

      <Box>
        <List>
          <ListItem button onClick={() => navigate("/dashboard/profile")}>
            <ListItemIcon sx={{ color: "white", cursor: "pointer" }}>
              <Avatar src={avatarImage} sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              primaryTypographyProps={{ fontSize: "14px" }}
              sx={{ color: "white", cursor: "pointer" }}
            />
          </ListItem>

          <ListItem
            button
            onClick={() => navigate("/dashboard/changepassword")}
          >
            <ListItemIcon sx={{ color: "white", cursor: "pointer" }}>
              <EditIcon />
            </ListItemIcon>
            <ListItemText
              primary="Change Password"
              primaryTypographyProps={{ fontSize: "14px" }}
              sx={{ color: "white", cursor: "pointer" }}
            />
          </ListItem>
        </List>

        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: "white", cursor: "pointer" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: "14px" }}
            sx={{ color: "white", cursor: "pointer" }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: "#0f172a",
          color: "white",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#0f172a",
          color: "white",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();
  const { photo } = useContext(UserContext);
  const defaultImage = "/default-avatar.png"; // or your actual fallback image path


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleAvatarClick = (event) =>
    setAnchorEl(anchorEl ? null : event.currentTarget);
  const handlePopperClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "#0f172a",
          color: "white",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              NexCoin
            </Typography>
          </Box>

          {user && (
            <Box>
              <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              <Avatar src={photo || defaultImage} />


              </IconButton>
              <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="bottom-end"
                disablePortal
                sx={{ zIndex: theme.zIndex.tooltip }}
              >
                <ClickAwayListener onClickAway={handlePopperClose}>
                  <Paper sx={{ mt: 1, p: 1.5, minWidth: 200, boxShadow: 3 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#1e293b", fontWeight: 600 }}
                      >
                        {user.displayName || "User"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#334155" }}>
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <MenuItem
                      onClick={() => {
                        navigate("/dashboard/changepassword");
                        handlePopperClose();
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <EditIcon />
                        Change Password
                      </Box>
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LogoutIcon />
                        Logout
                      </Box>
                    </MenuItem>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        avatarImage={photo}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard"
            sx={{ fontSize: "22px", fontWeight: "bold", cursor: "pointer" }}
          >
            Dashboard
          </Link>
          {location.pathname.includes("mytasks") && (
            <Typography
              color="text.primary"
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              My Tasks
            </Typography>
          )}
          {location.pathname === "/dashboard/tasks/pending" && (
            <Typography
              color="text.primary"
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              Pending Tasks
            </Typography>
          )}
          {location.pathname === "/dashboard/tasks/completed" && (
            <Typography
              color="text.primary"
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              Completed Tasks
            </Typography>
          )}
          {location.pathname === "/dashboard/changepassword" && (
            <Typography
              color="text.primary"
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              Change Password
            </Typography>
          )}
          {location.pathname === "/dashboard/profile" && (
            <Typography
              color="text.primary"
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              Profile
            </Typography>
          )}
        </Breadcrumbs>

        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="mytasks" element={<TaskTable />} />
            <Route
              path="tasks/pending"
              element={<TaskTable statusFilter="Pending" />}
            />
            <Route
              path="tasks/completed"
              element={<TaskTable statusFilter="Completed" />}
            />
            <Route path="changepassword" element={<ChangePassword />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </Box>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="caption" color="#64748b">
            Version {packageJson.version}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
