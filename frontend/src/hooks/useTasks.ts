import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../services/api';
import { Task } from '../models/Task';

export const useTasks = () => {
  const queryClient = useQueryClient();
  
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: taskApi.getTasks
  });

  // Add task mutation (accepts Task without id)
  const addMutation = useMutation({
    mutationFn: (task: Omit<Task, 'id'>) => taskApi.addTask(task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });

  // Update task mutation (requires full Task with id)
  const updateMutation = useMutation({
    mutationFn: (task: Task) => taskApi.updateTask(task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });

  // Delete task mutation (accepts just id)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });

  return {
    tasks,
    addTask: addMutation.mutate,
    toggleTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,
    updateTask: updateMutation.mutate,
    isLoading: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};