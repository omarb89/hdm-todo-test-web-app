import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [editedTask] = useState<Task | null>(null);

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      handleFetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleSave = async () => {
    if (newTaskName.trim()) {
      try {
        await api.post('/tasks', { name: newTaskName });
        setNewTaskName('');
        handleFetchTasks();
      } catch (error) {
        console.error("Failed to save task", error);
      }
    }
  };

  const handleCheck = async (task: Task) => {
    if (editedTask && editedTask.id === task.id && editedTask.name !== task.name) {
      try {
        await api.put(`/tasks/${task.id}`, { name: editedTask.name });
        handleFetchTasks();
      } catch (error) {
        console.error("Failed to update task", error);
      }
    }
  };

  const handleChange = (id: number, name: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, name } : task
    );
    setTasks(updatedTasks);
  };

  useEffect(() => {
    handleFetchTasks();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {tasks.map((task) => (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
            <TextField
              size="small"
              value={task.name}
              onChange={(e) => handleChange(task.id, e.target.value)}
              fullWidth
              sx={{ maxWidth: 350 }}
            />
            <Box>
              <IconButton color="success" onClick={() => handleCheck(task)} disabled={editedTask?.name === task.name}>
                <Check />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(task.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <TextField
            size="small"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            fullWidth
            sx={{ maxWidth: 350 }}
            placeholder="Ajouter une nouvelle tâche"
          />
          <Button variant="outlined" onClick={handleSave}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
