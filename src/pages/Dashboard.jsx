import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const StyledCard = styled(Card)(() => ({
  width: 270,
  height: 240,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: 16,
  border: "2px solid",
  borderColor: "#0f172a",
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  textAlign: "center",
  transition: "transform 0.2s ease",
  backgroundColor: "#ffffff",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
}));

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tasks, setTasks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [status, setStatus] = useState("Pending");

  const cardColors = [
    "#ffe0c6",
    "#bfffdb",
    "#ffd7dc",
    "#dbf1ff",
    "#fffdce",
    "#ebebff",
    "#e8f2c3ff",
  ];

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetched);
    });

    return () => unsubscribe();
  }, []);

  const resetDialog = () => {
    setTitle("");
    setDueDate("");
    setNotes("");
    setPriority("Medium");
    setIsEditMode(false);
    setStatus("Pending");
    setCurrentTaskId(null);
    setOpen(false);
  };

  const handleAddOrEditTask = async () => {
    if (!title.trim()) return alert("Task name is required.");
    try {
      const taskData = {
        title: title.trim(),
        dueDate,
        notes: notes.trim(),
        priority,
        status,
      };

      if (isEditMode && currentTaskId) {
        const taskRef = doc(db, "tasks", currentTaskId);
        await updateDoc(taskRef, taskData);
      } else {
        await addDoc(collection(db, "tasks"), {
          ...taskData,
          createdAt: Timestamp.now(),
        });
      }

      resetDialog();
    } catch (error) {
      console.error("❌ Error saving task:", error);
      alert("Failed to save task.");
    }
  };

  const handleEditClick = (task) => {
    setTitle(task.title);
    setDueDate(task.dueDate);
    setNotes(task.notes);
    setPriority(task.priority || "Medium");
    setIsEditMode(true);
    setCurrentTaskId(task.id);
    setOpen(true);
  };

  return (
    <Box p={2}>
      <Grid container spacing={4} sx={{ mx: "auto", maxWidth: "1600px" }}>
        {/* Add Task Card */}
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <EditNoteIcon sx={{ fontSize: 40, color: "#0f172a" }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Create Task
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setOpen(true);
                  setIsEditMode(false);
                }}
                sx={{
                  mt: 2,
                  borderColor: "#0f172a",
                  color: "#0f172a",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                Add Task
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Task Cards */}
        {tasks.map((task, index) => (
          <Grid item xs={12} sm={6} md={3} key={task.id}>
            <Card
              sx={{
                width: 270,
                height: 240,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2,
                border: "2px solid #0f172a",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                backgroundColor: cardColors[index % cardColors.length],
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      color: "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {task.title}
                  </Typography>

                  <Tooltip title="Edit Task">
                    <IconButton
                      size="small"
                      disableRipple
                      onClick={() => handleEditClick(task)}
                      sx={{ "&:hover": { backgroundColor: "transparent" } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  📅 Due:{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {task.dueDate || "Not set"}
                  </strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontFamily: "'Segoe UI', sans-serif",
                    fontSize: "0.95rem",
                    fontStyle: "italic",
                    color: "#334155",
                    minHeight: 50,
                    lineHeight: 1.5,
                  }}
                >
                  {task.notes || "No notes added."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={resetDialog} fullWidth maxWidth="sm">
        <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle sx={{ m: 0 }}>
              {isEditMode ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <IconButton onClick={resetDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              label="Task Name"
              fullWidth
              required
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <TextField
              label="Priority"
              select
              fullWidth
              margin="normal"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
            <TextField
              label="Status"
              select
              fullWidth
              margin="normal"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={resetDialog} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleAddOrEditTask}
              variant="contained"
              color="primary"
            >
              {isEditMode ? "Update Task" : "Save Task"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
