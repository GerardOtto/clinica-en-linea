import React from 'react';
import './profesionales.css';
import Cabecera from './Header'
import { Link } from 'react-router-dom';

const professionals = [
  { name: "Nombre", description: "Descripción de la persona, contacto, especialidad y horario de atención" },
  { name: "Nombre", description: "Descripción de la persona, contacto, especialidad y horario de atención" },
  { name: "Nombre", description: "Descripción de la persona, contacto, especialidad y horario de atención" },
  { name: "Nombre", description: "Descripción de la persona, contacto, especialidad y horario de atención" }
];

const Professionals = () => {
  return (
    <>
    <Cabecera />
    <div className="professionals-container">
      <main className="professionals-content">
        {professionals.map((professional, index) => (
          <div key={index} className="professional-card">
            <div className="image-placeholder">Imagen del profesional</div>
            <div className="professional-info">
              <h2>{professional.name}</h2>
              <p>{professional.description}</p>
              <Link to='/perfilPro'><button className="schedule-button">Ver perfil</button></Link>
            </div>
          </div>
        ))}
      </main>
    </div>
    </>
  );
};

export default Professionals;
