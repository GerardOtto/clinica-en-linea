import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Logo1 from './Cafan-logo-1.png';

const Header = ({ inSesion, isAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Manejo de cierre de sesión
    localStorage.removeItem('token-sesion'); // Eliminar el token de sesión
    localStorage.removeItem('token');
    window.location.reload(); // Recargar la página para reflejar los cambios
  };

  const handleClickMisReservas = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace
    if (inSesion) {
      navigate('/misCitas');
    } else {
      alert('Debe iniciar sesión para ver sus citas!');
      navigate('/login');
    }
  };


  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <button className="logo-button">
            <img src={Logo1} alt="Cafan Logo" style={{ width: "350px", height: "110px" }} />
          </button>
        </Link>
      </div>
      <div className="nav-right">
        <ul className="nav-buttons">
          <li>
            <Link to="/registro">
              <button>Registrarse</button>
            </Link>
          </li>
          <li>
            {inSesion ? (
              <button onClick={handleLogout}>Cerrar sesión</button>
            ) : (
              <Link to="/login">
                <button>Iniciar sesión</button>
              </Link>
            )}
          </li>
          <li>
            {isAdmin ? (
              <Link to='/administrarEspecialistas'><button>Administrar especialistas</button></Link>
            ) : (<></>)}
          </li>
          <li>
            {isAdmin ? (
              <Link to='/administrarCitas'><button>Administrar citas</button></Link>
            ) : (<></>)}
          </li>
        </ul>
        <input type="text" placeholder="Buscar" className="search-input" />
      </div>
      <nav className="nav-links">
        <Link to="/profesionales">Profesionales</Link>
        <Link to="/agendarCita">Agendar cita</Link>
        <Link to="/">Informaciones</Link>
        <Link to="/" onClick={handleClickMisReservas}>Mis reservas</Link>
        <Link to="/">Chat directo</Link>
      </nav>
    </header>
  );
};

export default Header;
