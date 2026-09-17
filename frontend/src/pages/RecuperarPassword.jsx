import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function RecuperarPassword() {
  const [form, setForm] = useState({
    registro_academico: '',
    correo: '',
    passwordNueva: '',
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
      await api.post('/usuarios/recuperar-password', form);
      alert('Contraseña restablecida correctamente');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Datos incorrectos');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="registro_academico"
            placeholder="Registro Académico"
            value={form.registro_academico}
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
            name="passwordNueva"
            type="password"
            placeholder="Nueva contraseña"
            value={form.passwordNueva}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Procesando...' : 'RESTABLECER'}
          </button>
        </form>

        <Link to="/">Volver al login</Link>
      </div>
    </div>
  );
}

export default RecuperarPassword;