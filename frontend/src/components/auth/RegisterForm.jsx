import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
        name,
        email,
        password
      });

      if (response.data.success) {
        // Guardar token y redirigir
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.data.error || 'Error al registrarse');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 
                err.response.data.message || 
                'Error al registrarse');
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            minLength="2"
            disabled={loading}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            minLength="6"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;