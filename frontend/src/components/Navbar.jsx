import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/inicio">ECYS - Récord Catedráticos</Link>
      </div>
      <div className="navbar-links">
        <Link to="/inicio">Inicio</Link>
        <Link to="/crear-publicacion">Crear Publicación</Link>
        <Link to={`/perfil/${usuario?.id_usuario}`}>Mi Perfil</Link>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;