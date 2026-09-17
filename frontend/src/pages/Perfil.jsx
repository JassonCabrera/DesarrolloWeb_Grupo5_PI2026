import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function Perfil() {
  const { id } = useParams();
  const { usuario: usuarioLogueado } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombres: '', apellidos: '', correo: '' });
  const [guardando, setGuardando] = useState(false);

  const esMiPerfil = Number(id) === Number(usuarioLogueado?.id_usuario);

  // Cargar perfil
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError('');
      try {
        const res = await api.get(`/usuarios/${id}`);
        setPerfil(res.data);
        setForm({
          nombres: res.data.nombres,
          apellidos: res.data.apellidos,
          correo: res.data.correo,
        });
      } catch (err) {
        setError(err.response?.data?.mensaje || 'Usuario no encontrado');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await api.put(`/usuarios/${id}`, form);
      setPerfil({ ...perfil, ...form });
      setEditando(false);
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al actualizar');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <p>Cargando perfil...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <p className="error">{error}</p>
          <button onClick={() => navigate('/inicio')}>Volver al inicio</button>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="perfil-card">
          <h1>{esMiPerfil ? 'Mi Perfil' : `Perfil de ${perfil.nombres}`}</h1>

          {editando ? (
            <form className="perfil-form" onSubmit={handleGuardar}>
              <div className="form-group">
                <label>Registro Académico (no editable)</label>
                <input type="text" value={perfil.registro_academico} disabled />
              </div>
              <div className="form-group">
                <label>Nombres</label>
                <input name="nombres" value={form.nombres} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Apellidos</label>
                <input name="apellidos" value={form.apellidos} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Correo</label>
                <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
              </div>
              <div className="perfil-acciones">
                <button type="submit" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button type="button" className="btn-cancelar" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="perfil-info">
                <p><strong>Registro Académico:</strong> {perfil.registro_academico}</p>
                <p><strong>Nombres:</strong> {perfil.nombres}</p>
                <p><strong>Apellidos:</strong> {perfil.apellidos}</p>
                <p><strong>Correo:</strong> {perfil.correo}</p>
              </div>

              <div className="perfil-acciones">
                {esMiPerfil && (
                  <button onClick={() => setEditando(true)}>Editar perfil</button>
                )}
                <Link to={`/perfil/${id}/cursos`} className="btn-secundario">
                  Ver cursos aprobados
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Perfil;