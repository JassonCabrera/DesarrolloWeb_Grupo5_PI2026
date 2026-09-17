import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarPassword from './pages/RecuperarPassword';
import Inicio from './pages/Inicio';
import CrearPublicacion from './pages/CrearPublicacion';
import Perfil from './pages/Perfil';
import CursosAprobados from './pages/CursosAprobados';
import BuscarUsuario from './pages/BuscarUsuario';
import './App.css';

function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar" element={<RecuperarPassword />} />
          <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/crear-publicacion" element={<RutaProtegida><CrearPublicacion /></RutaProtegida>} />
          <Route path="/perfil/:id" element={<RutaProtegida><Perfil /></RutaProtegida>} />
          <Route path="/perfil/:id/cursos" element={<RutaProtegida><CursosAprobados /></RutaProtegida>} />
          <Route path="/buscar/:registro" element={<RutaProtegida><BuscarUsuario /></RutaProtegida>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;