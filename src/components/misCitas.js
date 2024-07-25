import React, { useState, useEffect } from 'react';
import { redirect } from 'react-router-dom';
import './misCitas.css';

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [especialistas, setEspecialistas] = useState({});

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchEspecialista = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/especialista/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEspecialistas(prevState => ({
        ...prevState,
        [id]: data.nombre // Assuming the response contains the name of the specialist
      }));
    } catch (error) {
      console.error(`Error al recuperar especialista con id ${id}:`, error);
    }
  };

  const fetchCitas = async () => {
    const token = localStorage.getItem('token-sesion');
    console.log('Token de sesión:', token); // Asegúrate de que el token se muestra correctamente

    if (!token) {
      console.error('Debe iniciar sesión primero');
      alert('Debe iniciar sesión primero');
      return redirect ("/login");
    }

    try {
      const response = await fetch('http://localhost:4000/misCitas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Filtramos las citas según el nombre del paciente en el token
      const citasFiltradas = data.filter(cita => cita.rutPaciente === token);
      setCitas(citasFiltradas);

      // Fetch details for each specialist
      citasFiltradas.forEach(cita => {
        if (!especialistas[cita.especialista_id]) {
          fetchEspecialista(cita.especialista_id);
        }
      });
    } catch (error) {
      console.error('Error al recuperar citas:', error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mis-citas">
      <h2>Mis Citas</h2>
      {citas.length > 0 ? (
        <ul>
          {citas.map(cita => (
            <li key={cita.id}>
              <span className="cita-fecha">{formatDate(cita.fecha)} entre las {cita.hora} horas</span>
              <span className="cita-descripcion">{cita.descripcion}</span>
              <span className="cita-especialista">Especialista: {especialistas[cita.especialista_id] || 'Cargando...'}</span>
              {cita.imagen ? (
             <span style={{paddingTop:"10px", paddingBottom:"10px"}}>Imagen adjunta: </span>
            ) : (
              <div style={{paddingTop:"5px"}}></div>
            )}
              <span className='cita-imagen'>{cita.imagen && (
                  <img src={`http://localhost:4000/${cita.imagen}`} alt="Imagen adjunta a la cita" width="300" />
                )}</span>
              <span className='cita-estado'>Estado de la cita: {cita.estado}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay citas programadas.</p>
      )}
    </div>
  );
};

export default MisCitas;
