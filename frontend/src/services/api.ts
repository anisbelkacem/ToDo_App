import axios from 'axios';
import { Task } from '../models/Task';

const API_PREFIX = '/api/tasks'; 

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get(API_PREFIX); 
  return response.data;
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  console.log('add Task in api.ts', task);
  const response = await axios.post(API_PREFIX, task, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put(`${API_PREFIX}/${task.id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_PREFIX}/${id}`);
};
