import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTask } from '../services/api';
import { Task } from '../models/Task';
//import { TextField, Button, Box, CircularProgress } from '@mui/material';
import {
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
interface AddTaskProps {
  onAdd: (title: string) => Promise<void>;
}

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id'>) => {
      const result = await addTask(newTask);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setTaskTitle('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    mutation.mutate({ 
      title: taskTitle, 
      completed: false 
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h6" mb={2} fontWeight="bold">
        Add a New Task
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            label="Task Description"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            disabled={mutation.isPending}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 1,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={!mutation.isPending && <AddIcon />}
            disabled={!taskTitle.trim() || mutation.isPending}
            sx={{ minWidth: 140, height: 56, borderRadius: 2 }}
          >
            {mutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Add Task'
            )}
          </Button>
        </Box>

        {mutation.isError && (
          <Typography color="error" mt={2}>
            Error adding task: {(mutation.error as Error).message}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default AddTask;