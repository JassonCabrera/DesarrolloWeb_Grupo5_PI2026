import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function PublicacionCard({ publicacion }) {
  const { usuario } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarComentarios = async () => {
    try {
      const res = await api.get(`/comentarios/publicacion/${publicacion.id_publicacion}`);
      setComentarios(res.data);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    }
  };

  const toggleComentarios = async () => {
    if (!mostrarComentarios) {
      await cargarComentarios();
    }
    setMostrarComentarios(!mostrarComentarios);
  };

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setCargando(true);

    try {
      await api.post('/comentarios', {
        id_publicacion: publicacion.id_publicacion,
        id_usuario: usuario.id_usuario,
        mensaje: nuevoComentario,
      });
      setNuevoComentario('');
      await cargarComentarios();
    } catch (err) {
      console.error('Error al enviar comentario:', err);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-GT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="publicacion-card">
      <div className="publicacion-header">
        <div className="publicacion-usuario">
          <strong>{publicacion.usuario}</strong>
          <span className="registro">{publicacion.registro_academico}</span>
        </div>
        <span className="fecha">{formatearFecha(publicacion.fecha_creacion)}</span>
      </div>

      <div className="publicacion-target">
        {publicacion.nombre_curso && (
          <span className="tag tag-curso">
            Curso: {publicacion.codigo_curso} - {publicacion.nombre_curso}
          </span>
        )}
        {publicacion.catedratico && (
          <span className="tag tag-catedratico">
            Catedrático: {publicacion.catedratico}
          </span>
        )}
      </div>

      <p className="publicacion-mensaje">{publicacion.mensaje}</p>

      <button className="btn-comentarios" onClick={toggleComentarios}>
        {mostrarComentarios ? 'Ocultar comentarios' : `Ver comentarios (${comentarios.length || ''})`}
      </button>

      {mostrarComentarios && (
        <div className="comentarios-seccion">
          {comentarios.length === 0 ? (
            <p className="sin-comentarios">No hay comentarios aún.</p>
          ) : (
            comentarios.map((c) => (
              <div key={c.id_comentario} className="comentario">
                <div className="comentario-header">
                  <strong>{c.usuario}</strong>
                  <span className="fecha">{formatearFecha(c.fecha_creacion)}</span>
                </div>
                <p>{c.mensaje}</p>
              </div>
            ))
          )}

          <form className="form-comentario" onSubmit={enviarComentario}>
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              disabled={cargando}
            />
            <button type="submit" disabled={cargando}>
              {cargando ? '...' : 'Enviar'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PublicacionCard;