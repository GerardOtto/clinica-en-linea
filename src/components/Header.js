// Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Logo1 from './Cafan-logo-1.png';
import Modal from './popUpLogin';
import Formulario from './formulario-login';

const Header = ({ inSesion, isAdmin }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token-sesion');
    localStorage.removeItem('token');
    localStorage.removeItem('esEspecialista');
    window.location.reload();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleClickMisReservas = (e) => {
    e.preventDefault();
    if (inSesion) {
      navigate('/misCitas');
    } else {
      alert('Debe iniciar sesión para ver sus citas!');
      handleOpenModal();
    }
  };

  const handleClickAgendarCita = (e) => {
    e.preventDefault();
    if (inSesion) {
      navigate('/agendarCita');
    } else {
      alert('Debe iniciar sesión para agendar una cita!');
      handleOpenModal();
    }
  };

  // Función para manejar el cambio en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    handleSearch(event.target.value); // Realizar la búsqueda cuando cambia el input
  };

  // Función para manejar la búsqueda
  const handleSearch = async (term) => {
    if (term.length > 1) {
      try {
        const response = await fetch(`http://localhost:4000/buscar?termino=${term}`);
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <button className="logo-button">
            <img src={Logo1} alt="Cafan Logo" style={{ width: '350px', height: '110px' }} />
          </button>
        </Link>
      </div>
      <div className="nav-right">
        <ul className="nav-buttons">
          <li>
            <Link to="/registro">
              <button>Crear cuenta</button>
            </Link>
          </li>
          <li>
            {inSesion ? (
              <button onClick={handleLogout}>Cerrar sesión</button>
            ) : (
              <button onClick={handleOpenModal}>Iniciar sesión</button>
            )}
          </li>
          <li>
            {isAdmin && <Link to="/administrarEspecialistas"><button>Administrar especialistas</button></Link>}
          </li>
          <li>
            {isAdmin && <Link to="/administrarCitas"><button>Administrar citas</button></Link>}
          </li>
        </ul>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar especialista/especialidad"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map((result) => (
                <li key={result.id} className="search-item">
                  {result.nombre} - {result.especialidad}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <nav className="nav-links">
        <Link to="/profesionales">Profesionales</Link>
        <Link to="/" onClick={handleClickAgendarCita}>Agendar cita</Link>
        <Link to="/informaciones">Informaciones</Link>
        <Link to="/" onClick={handleClickMisReservas}>Mis reservas</Link>
        <Link to="https://wa.me/975348882?text=Hola! Me gustaría solicitar información sobre el centro Cafan!">Chat directo</Link>
      </nav>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <Formulario onClose={handleCloseModal} />
      </Modal>
    </header>
  );
};

export default Header;
