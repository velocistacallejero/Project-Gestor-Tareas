import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const TeamTasks = () => {
  const [teamTasks, setTeamTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    endDate: format(new Date(), 'yyyy-MM-dd'),
    assignedTo: ''
  });

  useEffect(() => {
    fetchTeamTasks();
    fetchTeamMembers();
  }, []);

  const fetchTeamTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/team-tasks');
      setTeamTasks(response.data);
    } catch (err) {
      console.error('Error fetching team tasks:', err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/team/members');
      setMembers(response.data);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/team-tasks', newTask);
      setNewTask({
        title: '',
        description: '',
        endDate: format(new Date(), 'yyyy-MM-dd'),
        assignedTo: ''
      });
      fetchTeamTasks();
    } catch (err) {
      console.error('Error creating team task:', err);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/team-tasks/${taskId}/status`, { status });
      fetchTeamTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
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
      <h1 className="text-2xl font-bold mb-6">Tareas del Equipo</h1>

      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Nueva Tarea Grupal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Fecha límite</label>
              <input
                type="date"
                name="endDate"
                value={newTask.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Asignar a</label>
              <select
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Seleccionar miembro</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Crear Tarea Grupal
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {teamTasks.map((task) => (
          <div key={task._id} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-gray-600 mb-2">{task.description}</p>
                <div className="flex items-center space-x-4 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {task.status === 'completed' ? 'Completada' : task.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                  </span>
                  <span className="text-sm">
                    Asignada a: <span className="font-semibold">{task.assignedTo?.name}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    Fecha límite: {format(new Date(task.endDate), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  className="px-2 py-1 border rounded-lg text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En progreso</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTasks;