import React, { useState } from 'react';
import { Task } from '../models/Task';
import {
  List,
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  Paper,
  Divider,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => Promise<void>;
  onUpdate: (task: Task) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TaskList = ({ tasks, onUpdate, onDelete }: TaskListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
  };

  const handleSaveEdit = async () => {
    if (editingTask) {
      setIsProcessing(true);
      try {
        await onUpdate({ ...editingTask, title: editedTitle });
        setEditingTask(null);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDeleteClick = (id: number) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete !== null) {
      setIsProcessing(true);
      try {
        await onDelete(taskToDelete);
      } finally {
        setIsProcessing(false);
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setIsProcessing(true);
    try {
      await onUpdate({ ...task, completed: !task.completed });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ mt: 4, borderRadius: 3, overflow: 'hidden', backgroundColor: '#fdfdfd' }}>
        {tasks.length === 0 ? (
          <Box p={3}>
            <Typography variant="body1" color="text.secondary" align="center">
              No tasks yet. Add your first task!
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <ListItem
                  secondaryAction={
                    <>
                      {editingTask?.id === task.id ? (
                        <>
                          <IconButton edge="end" onClick={handleSaveEdit} disabled={isProcessing} sx={{ ml: 1 }}>
                            <Save color="primary" />
                          </IconButton>
                          <IconButton edge="end" onClick={handleCancelEdit} disabled={isProcessing} sx={{ ml: 1 }}>
                            <Cancel color="secondary" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditClick(task)}
                            disabled={isProcessing}
                            sx={{ ml: 1 }}
                          >
                            <Edit color="primary" />
                            
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteClick(task.id!)}
                            disabled={isProcessing}
                            sx={{ color: 'error.main' ,ml:1 }}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </>
                  }
                  sx={{
                    px: 3,
                    py: 2,
                    transition: 'background-color 0.2s ease',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    disabled={isProcessing || editingTask?.id === task.id}
                  />
                  {editingTask?.id === task.id ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      disabled={isProcessing}
                    />
                  ) : (
                    <ListItemText
                      primary={task.title}
                      sx={{
                        ml: 1,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.disabled' : 'text.primary',
                      }}
                    />
                  )}
                </ListItem>
                {index < tasks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !isProcessing && setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isProcessing}
            startIcon={<Delete />}
          >
            {isProcessing ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskList;