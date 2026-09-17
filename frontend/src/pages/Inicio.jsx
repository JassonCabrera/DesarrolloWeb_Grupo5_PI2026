import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import PublicacionCard from '../components/PublicacionCard';

function Inicio() {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [filtroCursoId, setFiltroCursoId] = useState('');
  const [filtroCatedraticoId, setFiltroCatedraticoId] = useState('');
  const [filtroNombreCurso, setFiltroNombreCurso] = useState('');
  const [filtroNombreCatedratico, setFiltroNombreCatedratico] = useState('');

  // Buscador de usuarios
  const [busquedaUsuario, setBusquedaUsuario] = useState('');

  // Cargar cursos y catedráticos al inicio (para los dropdowns)
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
        console.error('Error al cargar datos auxiliares:', err);
      }
    };
    cargarDatos();
  }, []);

  // Cargar publicaciones cada vez que cambia algún filtro
  useEffect(() => {
    const cargarPublicaciones = async () => {
      setCargando(true);
      try {
        const params = {};
        if (filtroCursoId) params.id_curso = filtroCursoId;
        if (filtroCatedraticoId) params.id_catedratico = filtroCatedraticoId;
        if (filtroNombreCurso) params.curso = filtroNombreCurso;
        if (filtroNombreCatedratico) params.profesor = filtroNombreCatedratico;

        const res = await api.get('/publicaciones', { params });
        setPublicaciones(res.data);
      } catch (err) {
        console.error('Error al cargar publicaciones:', err);
      } finally {
        setCargando(false);
      }
    };

    const timeout = setTimeout(cargarPublicaciones, 300);
    return () => clearTimeout(timeout);
  }, [filtroCursoId, filtroCatedraticoId, filtroNombreCurso, filtroNombreCatedratico]);

  const limpiarFiltros = () => {
    setFiltroCursoId('');
    setFiltroCatedraticoId('');
    setFiltroNombreCurso('');
    setFiltroNombreCatedratico('');
  };

  const buscarUsuario = (e) => {
    e.preventDefault();
    if (busquedaUsuario.trim()) {
      navigate(`/buscar/${busquedaUsuario.trim()}`);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <h1>Publicaciones</h1>

        {/* Buscador de usuarios */}
        <div className="buscador-usuarios">
          <h3>Buscar usuario por registro académico</h3>
          <form onSubmit={buscarUsuario}>
            <input
              type="text"
              placeholder="Ej: 202100002"
              value={busquedaUsuario}
              onChange={(e) => setBusquedaUsuario(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        </div>

        {/* Filtros de publicaciones */}
        <div className="filtros">
          <h3>Filtros</h3>
          <div className="filtros-grid">
            <div>
              <label>Curso (lista)</label>
              <select value={filtroCursoId} onChange={(e) => setFiltroCursoId(e.target.value)}>
                <option value="">Todos los cursos</option>
                {cursos.map((c) => (
                  <option key={c.id_curso} value={c.id_curso}>
                    {c.codigo} - {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Catedrático (lista)</label>
              <select value={filtroCatedraticoId} onChange={(e) => setFiltroCatedraticoId(e.target.value)}>
                <option value="">Todos los catedráticos</option>
                {catedraticos.map((c) => (
                  <option key={c.id_catedratico} value={c.id_catedratico}>
                    {c.nombres} {c.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Buscar por nombre de curso</label>
              <input
                type="text"
                placeholder="Ej: Bases de Datos"
                value={filtroNombreCurso}
                onChange={(e) => setFiltroNombreCurso(e.target.value)}
              />
            </div>

            <div>
              <label>Buscar por nombre de catedrático</label>
              <input
                type="text"
                placeholder="Ej: Pérez"
                value={filtroNombreCatedratico}
                onChange={(e) => setFiltroNombreCatedratico(e.target.value)}
              />
            </div>
          </div>

          <button className="btn-limpiar" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>

        {/* Listado de publicaciones */}
        {cargando ? (
          <p>Cargando publicaciones...</p>
        ) : publicaciones.length === 0 ? (
          <p className="sin-publicaciones">No hay publicaciones que coincidan con los filtros.</p>
        ) : (
          <div className="publicaciones-lista">
            {publicaciones.map((p) => (
              <PublicacionCard key={p.id_publicacion} publicacion={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Inicio;