// src/components/AddTaskDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const AddTaskDialog = ({ open, handleClose }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Task title is required.");
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
      handleClose();
    } catch (err) {
      console.error("❌ Error saving task:", err);
      alert("Failed to save task.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add a New Task</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Task Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Due Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Notes"
          multiline
          fullWidth
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;
