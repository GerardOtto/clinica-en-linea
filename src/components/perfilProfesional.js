import React, { useState, useEffect } from 'react';
import './perfilProfesional.css';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const [especialista, setEspecialista] = useState(null);
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    const fetchEspecialista = async () => {
      try {
        const response = await fetch(`http://localhost:4000/especialista/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEspecialista(data);
      } catch (error) {
        console.error('Error al recuperar especialista:', error);
      }
    };

    fetchEspecialista();
  }, [id]);

  if (!especialista) {
    return <div>Cargando...</div>;
  }

  const handleAgendarClick = () => {
    navigate(`/agendarCita?especialistaId=${id}`);
  };

  return (
    <>
      <div className="profile-container">
        <main className="profile-content" style={{marginTop:"40px"}}>
          <div className="image-section"
            style={{ 
              width: "30%",
              border: "1px solid #ccc",
              padding: "20px",
              textAlign: 'center'
            }}>
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
          <div className="info-section">
            <h2>{especialista.nombre}</h2>
            <p>Contacto: {especialista.contacto}</p>
            <p>Especialidad: {especialista.especialidad}</p>
            <p>Horario de Atención: {especialista.horarioAtencion}</p>
            <p>{especialista.descripcion}</p>
          </div>
        </main>
        <footer className="profile-footer">
          <button className="footer-button" onClick={handleAgendarClick}>Agendar</button>
          <a href={`mailto:${especialista.correo}?subject=Consulta Cafan&body=Por favor ingrese su consulta y sus datos para que el especialista se ponga en contacto con usted.`}>
            <button className="footer-button">Enviar correo (Gmail)</button>
          </a>
          <a href={`https://wa.me/${especialista.contacto}?text=Hola! Me gustaría solicitar información sobre su disponibilidad para una consulta`}>
            <button className="footer-button">Consulta directa (Whatsapp)</button>
          </a>
        </footer>
      </div>
    </>
  );
};

export default Profile;
