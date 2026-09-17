import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function BuscarUsuario() {
  const { registro } = useParams();
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const buscar = async () => {
      try {
        const res = await api.get(`/usuarios/buscar/${registro}`);
        setResultados(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    buscar();
  }, [registro]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <h1>Resultados de búsqueda</h1>
        <p className="subtitulo">Buscando por: <strong>{registro}</strong></p>

        {cargando ? (
          <p>Cargando...</p>
        ) : resultados.length === 0 ? (
          <p className="sin-publicaciones">No se encontraron usuarios.</p>
        ) : (
          <div className="resultados-usuarios">
            {resultados.map((u) => (
              <div key={u.id_usuario} className="usuario-card">
                <div>
                  <strong>{u.nombres} {u.apellidos}</strong>
                  <p className="registro">Registro: {u.registro_academico}</p>
                  <p className="correo">{u.correo}</p>
                </div>
                <Link to={`/perfil/${u.id_usuario}`} className="btn-secundario">
                  Ver perfil
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="perfil-acciones">
          <Link to="/inicio" className="btn-secundario">Volver al inicio</Link>
        </div>
      </main>
    </div>
  );
}

export default BuscarUsuario;