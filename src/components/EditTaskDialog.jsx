
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const EditTaskDialog = ({ open, handleClose, task }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");


  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDueDate(task.dueDate || "");
      setNotes(task.notes || "");
    }
  }, [task]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      alert("Task title is required.");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        title: title.trim(),
        dueDate,
        notes: notes.trim(),
      });

      alert("✅ Task updated successfully!");
      handleClose();
    } catch (error) {
      console.error("❌ Error updating task:", error);
      alert("Failed to update task.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Task Title"
          fullWidth
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskDialog;
