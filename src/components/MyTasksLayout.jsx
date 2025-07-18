import React, { useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";

import EditNoteIcon from "@mui/icons-material/EditNote";

import { db } from "../firebase";

import { collection, addDoc, Timestamp } from "firebase/firestore";

const StyledCard = styled(Card)(() => ({
  borderRadius: 16,

  border: "2px solid",

  borderColor: "#0f172a",

  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",

  textAlign: "center",

  width: 300,

  transition: "transform 0.2s ease",

  "&:hover": {
    transform: "scale(1.03)",

    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
}));

const MyTasksLayout = () => {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");

  const [dueDate, setDueDate] = useState("");

  const [notes, setNotes] = useState("");

  const handleAddTask = async () => {
    if (!title.trim()) {
      alert("Task name is required.");

      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title: title.trim(),

        dueDate,

        notes: notes.trim(),

        createdAt: Timestamp.now(),
      });

      setTitle("");

      setDueDate("");

      setNotes("");

      setOpen(false);

      console.log("✅ Task added to Firestore!");
    } catch (error) {
      console.error("❌ Error adding task:", error);

      alert("Failed to add task.");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <EditNoteIcon sx={{ fontSize: 40, color: "#0f172a" }} />
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Create Tasks
            </Typography>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                mt: 2,

                borderColor: "#0f172a",

                color: "#0f172a",

                "&:hover": {
                  borderColor: "#0f172a",

                  backgroundColor: "#eff6ff",
                },
              }}
              onClick={() => setOpen(true)}
            >
              Add Task
            </Button>
          </CardContent>
        </StyledCard>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add New Task</DialogTitle>

        <DialogContent>
          <TextField
            label="Task Name"
            fullWidth
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
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>

          <Button variant="contained" onClick={handleAddTask}>
            Save Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyTasksLayout;
