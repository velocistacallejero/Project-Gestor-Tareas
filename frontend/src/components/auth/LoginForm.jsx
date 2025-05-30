import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true); // <-- ACTUALIZA EL ESTADO
        navigate('/dashboard');
      } else {
        setError(response.data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al iniciar sesión'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Ingresar
        </button>
        <p className="mt-4 text-center">
          ¿No tienes cuenta? <a href="/register" className="text-blue-500 hover:underline">Regístrate</a>
        </p>
        <p className="mt-2 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;