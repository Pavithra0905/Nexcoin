import React, { useEffect, useState, useMemo } from "react";
import EditTaskDialog from "./EditTaskDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TableContainer,
  Typography,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  Button,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import Lottie from "lottie-react";
import deleteAnimation from "../assets/lottie/Error Close Remove Delete Warning Alert.json";
import {
  updateDoc,
  doc,
  collection,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "#dc2626";
    case "Medium":
      return "#ca8a04";
    case "Low":
      return "#16a34a";
    default:
      return "#334155";
  }
};

const TaskTable = ({ statusFilter }) => {
  const [tasks, setTasks] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filtered = statusFilter
        ? taskData.filter((task) => task.status === statusFilter)
        : taskData;
      setTasks(filtered);
    });
    return () => unsubscribe();
  }, [statusFilter]);

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (sortConfig.key === "priority") {
          const order = { High: 1, Medium: 2, Low: 3 };
          return sortConfig.direction === "asc"
            ? order[a.priority] - order[b.priority]
            : order[b.priority] - order[a.priority];
        } else {
          const aVal = a[sortConfig.key] || "";
          const bVal = b[sortConfig.key] || "";
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
      });
    }
    return sorted;
  }, [tasks, sortConfig]);

  const handleSort = (key, direction = null) => {
    setSortConfig((prev) => ({
      key,
      direction:
        direction ||
        (prev.key === key && prev.direction === "asc" ? "desc" : "asc"),
    }));
  };

  const confirmDeleteTask = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await deleteDoc(doc(db, "users", user.uid, "tasks", taskToDelete));

      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("❌ Error deleting task:", err);
      alert("Failed to delete task.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {statusFilter ? `${statusFilter} Tasks` : "📋 My Task List"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="Sort Tasks">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <SortIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                handleSort("priority", "desc");
                setAnchorEl(null);
              }}
            >
              Priority: Low to High
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSort("priority", "asc");
                setAnchorEl(null);
              }}
            >
              Priority: High to Low
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSort("dueDate");
                setAnchorEl(null);
              }}
            >
              Sort by Due Date
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSort("title");
                setAnchorEl(null);
              }}
            >
              Sort by Title
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ width: "100%", overflowX: "auto", boxShadow: 3, borderRadius: 3 }}
      >
        <Table sx={{ minWidth: 1160 }}>
          <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Notes</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task, index) => (
                <TableRow
                  key={task.id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f8fafc" : "#ffffff",
                  }}
                >
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.dueDate || "-"}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        color: getPriorityColor(task.priority),
                        fontWeight: "bold",
                      }}
                    >
                      {task.priority || "-"}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 250,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {task.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={task.status || "Pending"}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          const user = auth.currentUser;
                          if (!user) return;
                          await updateDoc(
                            doc(db, "users", user.uid, "tasks", task.id),
                            { status: newStatus }
                          );
                        } catch (error) {
                          console.error("Error updating status:", error);
                        }
                      }}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 130,
                        fontWeight: "bold",
                        borderRadius: 1,
                        backgroundColor: "#f1f5f9",
                        color:
                          task.status === "Completed"
                            ? "#16a34a"
                            : task.status === "Pending"
                            ? "#eab308"
                            : "#3b82f6",
                      }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EditTaskDialog
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        task={selectedTask}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Confirm Delete
          </Typography>
          <Box sx={{ width: 200, mx: "auto", mb: 2 }}>
            <Lottie animationData={deleteAnimation} loop autoplay />
          </Box>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete this task?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteTask}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TaskTable;
