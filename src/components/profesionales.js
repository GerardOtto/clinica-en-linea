import React, { useState, useEffect } from 'react';
import './profesionales.css';
import { Link } from 'react-router-dom';

const Professionals = () => {
  const [especialistas, setEspecialistas] = useState([]);

  useEffect(() => {
    fetchEspecialistas();
  }, []);

  const fetchEspecialistas = async () => {
    try {
      const response = await fetch('http://localhost:4000/listarEspecialistas');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEspecialistas(data);
    } catch (error) {
      console.error('Error al recuperar especialistas:', error);
    }
  };

  return (
    <div className="professionals-container">
      <main className="professionals-content">
        {especialistas.map((especialista) => (
          <div key={especialista.id} className="professional-card">
            <div className="image-container">
              {especialista.imagen ? (
                <img
                  src={`http://localhost:4000/${especialista.imagen}`}
                  alt="Imagen del profesional"
                  className="profile-image"
                />
              ) : (
                'Imagen del profesional'
              )}
            </div>
            <div className="professional-info">
              <h2>{especialista.nombre}</h2>
              <p>Contacto: {especialista.contacto}</p>
              <p>Especialidad: {especialista.especialidad}</p>
              <p>Horario de Atención: {especialista.horarioAtencion}</p>
              <Link to={`/perfilPro/${especialista.id}`}>
                <button className="schedule-button">Ver perfil</button>
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Professionals;
