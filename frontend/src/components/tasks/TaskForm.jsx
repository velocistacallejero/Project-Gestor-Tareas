import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import TaskLocation from './TaskLocation'; // Importa el componente TaskLocation

const TaskForm = ({ task = null, onSave }) => {
  const [location, setLocation] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStartDate(task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd') : '');
      setEndDate(task.endDate ? format(new Date(task.endDate), 'yyyy-MM-dd') : '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'pending');
      setLocation(task.location || null);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      startDate,
      endDate,
      priority,
      status,
      location
    };

    try {
      if (task) {
        await axios.put(`http://localhost:5000/api/tasks/${task._id}`, taskData);
      } else {
        await axios.post('http://localhost:5000/api/tasks', taskData);
      }
      onSave();
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows="3"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Fecha de inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Fecha de fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Prioridad</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>
      </div>
      
      {/* Mapa de ubicación - solo se muestra si estamos editando una tarea existente */}
      {task && (
        <TaskLocation 
          taskId={task._id} 
          initialLocation={task.location} 
          onLocationChange={setLocation}
        />
      )}
      
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        {task ? 'Actualizar Tarea' : 'Crear Tarea'}
      </button>
    </form>
  );
};

export default TaskForm;