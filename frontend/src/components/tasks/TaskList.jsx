import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Tareas</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Nueva Tarea
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <TaskForm task={editingTask} onSave={handleSave} />
        </div>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-gray-600 mb-2">{task.description}</p>
                <div className="flex space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {task.status === 'completed' ? 'Completada' : task.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Inicio: {format(new Date(task.startDate), 'dd/MM/yyyy')}</p>
                  <p>Fin: {format(new Date(task.endDate), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingTask(task);
                    setShowForm(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;