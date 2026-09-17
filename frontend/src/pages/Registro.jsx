import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Registro() {
  const [form, setForm] = useState({
    registro_academico: '',
    nombres: '',
    apellidos: '',
    password: '',
    correo: '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await api.post('/usuarios/registro', form);
      alert('Usuario registrado correctamente');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Registro de Usuario</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="registro_academico"
            placeholder="Registro Académico"
            value={form.registro_academico}
            onChange={handleChange}
            required
          />
          <input
            name="nombres"
            placeholder="Nombres"
            value={form.nombres}
            onChange={handleChange}
            required
          />
          <input
            name="apellidos"
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={handleChange}
            required
          />
          <input
            name="correo"
            type="email"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'REGISTRARSE'}
          </button>
        </form>

        <Link to="/">Volver al login</Link>
      </div>
    </div>
  );
}

export default Registro;