import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function CrearPublicacion() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState('curso'); // 'curso' o 'catedratico'
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [idCurso, setIdCurso] = useState('');
  const [idCatedratico, setIdCatedratico] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resCursos, resCatedraticos] = await Promise.all([
          api.get('/cursos'),
          api.get('/catedraticos'),
        ]);
        setCursos(resCursos.data);
        setCatedraticos(resCatedraticos.data);
      } catch (err) {
        console.error(err);
      }
    };
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mensaje.trim()) {
      setError('El mensaje es obligatorio');
      return;
    }

    if (tipo === 'curso' && !idCurso) {
      setError('Selecciona un curso');
      return;
    }

    if (tipo === 'catedratico' && !idCatedratico) {
      setError('Selecciona un catedrático');
      return;
    }

    setCargando(true);
    try {
      await api.post('/publicaciones', {
        id_usuario: usuario.id_usuario,
        id_curso: tipo === 'curso' ? idCurso : null,
        id_catedratico: tipo === 'catedratico' ? idCatedratico : null,
        mensaje,
      });
      navigate('/inicio');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear publicación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <h1>Crear Publicación</h1>

        <form className="form-publicacion" onSubmit={handleSubmit}>
          <div className="tipo-selector">
            <label>
              <input
                type="radio"
                value="curso"
                checked={tipo === 'curso'}
                onChange={(e) => setTipo(e.target.value)}
              />
              Sobre un Curso
            </label>
            <label>
              <input
                type="radio"
                value="catedratico"
                checked={tipo === 'catedratico'}
                onChange={(e) => setTipo(e.target.value)}
              />
              Sobre un Catedrático
            </label>
          </div>

          {tipo === 'curso' ? (
            <div className="form-group">
              <label>Selecciona el curso</label>
              <select value={idCurso} onChange={(e) => setIdCurso(e.target.value)} required>
                <option value="">-- Seleccionar --</option>
                {cursos.map((c) => (
                  <option key={c.id_curso} value={c.id_curso}>
                    {c.codigo} - {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>Selecciona el catedrático</label>
              <select value={idCatedratico} onChange={(e) => setIdCatedratico(e.target.value)} required>
                <option value="">-- Seleccionar --</option>
                {catedraticos.map((c) => (
                  <option key={c.id_catedratico} value={c.id_catedratico}>
                    {c.nombres} {c.apellidos}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Mensaje</label>
            <textarea
              rows="6"
              placeholder="Escribe tu opinión o experiencia..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CrearPublicacion;