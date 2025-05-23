import React from 'react';
import { useTasks } from './hooks/useTasks';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Task } from './models/Task';

const App: React.FC = () => {
  const { tasks, addTask, updateTask,toggleTask, deleteTask, isLoading } = useTasks();

  const handleAddTask = async (title: string) => {
    try {
      await addTask({ title, completed: false });
      console.info('Task added successfully from app.tsx');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };
  const handleUpdateTask = async (updatedTask: Task) => {
  try {
    await updateTask(updatedTask);
    // Optionally invalidate queries or update local state
  } catch (error) {
    console.error('Error updating task:', error);
  }
};
  const handleToggleTask = async (task: Task) => {
    try {
      await toggleTask({ ...task, completed: !task.completed });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        To-Do
      </Typography>
      
      <AddTask onAdd={handleAddTask} />
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks?.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No tasks found. Add your first task!
        </Alert>
      ) : (
        <TaskList
          tasks={tasks || []}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
        />
      )}
    </Box>
  );
};

export default App;