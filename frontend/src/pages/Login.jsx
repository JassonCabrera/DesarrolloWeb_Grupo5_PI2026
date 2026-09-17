import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [registro, setRegistro] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const response = await api.post('/usuarios/login', {
        registro_academico: registro,
        password: password,
      });

      // Guardar usuario en el contexto
      login(response.data.usuario);

      // Redirigir al inicio
      navigate('/inicio');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Universidad de San Carlos de Guatemala</h1>
        <h2>Facultad de Ingeniería</h2>
        <h3>INICIAR SESIÓN INGENIERÍA USAC</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="CUI / REGISTRO ACADÉMICO / REGISTRO PERSONAL"
            value={registro}
            onChange={(e) => setRegistro(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>
            <input type="checkbox" /> Recordar mi usuario
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Iniciando...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <div className="links">
          <Link to="/recuperar">¿Olvidó su contraseña?</Link>
          <Link to="/registro">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;