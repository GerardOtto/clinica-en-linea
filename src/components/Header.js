import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><button className='logo-button'>LOGO</button></Link>
      </div>
      <h1 className="main-title">Clínica en línea</h1>
      <div className="nav-right">
        <ul className="nav-buttons">
          <li><Link to="/registro"><button>Registrarse</button></Link></li>
          <li><Link to="/login"><button>Iniciar sesión</button></Link></li>
        </ul>
        <input type="text" placeholder="Buscar" className="search-input" />
      </div>
      <nav className="nav-links">
        <Link to="/profesionales">Profesionales</Link>
        <Link to="/">Agendar cita</Link>
        <Link to="/">Informaciones</Link>
        <Link to="/">Mis reservas</Link>
        <Link to="/">Chat directo</Link>
      </nav>
    </header>
  );
}

export default Header;
