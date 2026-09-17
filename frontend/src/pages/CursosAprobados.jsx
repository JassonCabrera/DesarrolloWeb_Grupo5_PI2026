import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function CursosAprobados() {
  const { id } = useParams();
  const { usuario: usuarioLogueado } = useAuth();

  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [totalCreditos, setTotalCreditos] = useState(0);
  const [todosCursos, setTodosCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');

  const esMiPerfil = Number(id) === Number(usuarioLogueado?.id_usuario);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const res = await api.get(`/cursos-aprobados/${id}`);
      setCursosAprobados(res.data.cursos);
      setTotalCreditos(res.data.totalCreditos);

      if (esMiPerfil) {
        const resCursos = await api.get('/cursos');
        setTodosCursos(resCursos.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const agregarCurso = async (e) => {
    e.preventDefault();
    if (!cursoSeleccionado) return;

    try {
      await api.post('/cursos-aprobados', {
        id_usuario: Number(id),
        id_curso: Number(cursoSeleccionado),
      });
      setCursoSeleccionado('');
      await cargarDatos();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al agregar curso');
    }
  };

  const eliminarCurso = async (idCurso) => {
    if (!window.confirm('¿Eliminar este curso de aprobados?')) return;
    try {
      await api.delete(`/cursos-aprobados/${id}/${idCurso}`);
      await cargarDatos();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  // Cursos disponibles (los que no están aprobados aún)
  const cursosDisponibles = todosCursos.filter(
    (c) => !cursosAprobados.some((ca) => ca.id_curso === c.id_curso)
  );

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="perfil-card">
          <h1>Cursos Aprobados</h1>

          {cargando ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div className="creditos-total">
                <strong>Total de créditos: {totalCreditos}</strong>
              </div>

              {cursosAprobados.length === 0 ? (
                <p className="sin-publicaciones">No hay cursos aprobados aún.</p>
              ) : (
                <table className="tabla-cursos">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Créditos</th>
                      {esMiPerfil && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {cursosAprobados.map((c) => (
                      <tr key={c.id_curso}>
                        <td>{c.codigo}</td>
                        <td>{c.nombre}</td>
                        <td>{c.creditos}</td>
                        {esMiPerfil && (
                          <td>
                            <button
                              className="btn-eliminar"
                              onClick={() => eliminarCurso(c.id_curso)}
                            >
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {esMiPerfil && (
                <form className="form-agregar-curso" onSubmit={agregarCurso}>
                  <h3>Agregar curso aprobado</h3>
                  <div className="form-agregar-row">
                    <select
                      value={cursoSeleccionado}
                      onChange={(e) => setCursoSeleccionado(e.target.value)}
                      required
                    >
                      <option value="">-- Seleccionar curso --</option>
                      {cursosDisponibles.map((c) => (
                        <option key={c.id_curso} value={c.id_curso}>
                          {c.codigo} - {c.nombre} ({c.creditos} créditos)
                        </option>
                      ))}
                    </select>
                    <button type="submit">Agregar</button>
                  </div>
                </form>
              )}

              <div className="perfil-acciones">
                <Link to={`/perfil/${id}`} className="btn-secundario">
                  Volver al perfil
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CursosAprobados;