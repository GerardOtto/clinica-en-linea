import React, { useState, useEffect } from 'react';
import { redirect } from 'react-router-dom';
import './misCitas.css';

const MisCitas = () => {
  const [citasComoPaciente, setCitasComoPaciente] = useState([]);
  const [citasComoEspecialista, setCitasComoEspecialista] = useState([]);
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
      setEspecialistas((prevState) => ({
        ...prevState,
        [id]: data.nombre, // Assuming the response contains the name of the specialist
      }));
    } catch (error) {
      console.error(`Error al recuperar especialista con id ${id}:`, error);
    }
  };

  const fetchCitas = async () => {
    const tokenSesion = localStorage.getItem('token-sesion');
    const tokenEspecialista = localStorage.getItem('esEspecialista');

    console.log('Token de sesión:', tokenSesion);
    console.log('Token de especialista:', tokenEspecialista);

    if (!tokenSesion) {
      console.error('Debe iniciar sesión primero');
      alert('Debe iniciar sesión primero');
      return redirect('/login');
    }

    try {
      const response = await fetch('http://localhost:4000/misCitas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Filtrar citas como paciente
      const citasPaciente = data.filter((cita) => cita.rutPaciente === tokenSesion);

      // Filtrar citas como especialista
      const citasEspecialista = tokenEspecialista
        ? data.filter((cita) => cita.especialista_id.toString() === tokenEspecialista)
        : [];

      setCitasComoPaciente(citasPaciente);
      setCitasComoEspecialista(citasEspecialista);

      // Fetch details for each specialist
      [...citasPaciente, ...citasEspecialista].forEach((cita) => {
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
      day: 'numeric',
    });
  };

  // Función para manejar la edición de una cita
  const handleEditCita = (citaId) => {
    // Implementar la lógica de edición, por ejemplo, redirigir a un formulario de edición
    console.log(`Editar cita con ID: ${citaId}`);
    // Ejemplo: redirigir a una ruta de edición con el ID de la cita
    // navigate(`/editarCita/${citaId}`);
  };

  // Función para manejar la cancelación de una cita
  const handleCancelCita = async (citaId) => {
    const confirmar = window.confirm('¿Está seguro de que desea cancelar esta cita?');
    if (!confirmar) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:4000/cancelarCita/${citaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Actualizar el estado de citas después de cancelar
      setCitasComoEspecialista((prevCitas) =>
        prevCitas.filter((cita) => cita.id !== citaId)
      );
      alert('Cita cancelada con éxito');
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      alert('Hubo un error al cancelar la cita. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="mis-citas">
      <h2>Mis Citas</h2>

      <h3>Citas como Paciente</h3>
      {citasComoPaciente.length > 0 ? (
        <ul>
          {citasComoPaciente.map((cita) => (
            <li key={cita.id}>
              <span className="cita-fecha">
                {formatDate(cita.fecha)} entre las {cita.hora} horas
              </span>
              <span className="cita-descripcion">{cita.descripcion}</span>
              <span className="cita-especialista">
                Especialista: {especialistas[cita.especialista_id] || 'Cargando...'}
              </span>
              {cita.imagen ? (
                <span style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  Imagen adjunta:{' '}
                </span>
              ) : (
                <div style={{ paddingTop: '5px' }}></div>
              )}
              <span className="cita-imagen">
                {cita.imagen && (
                  <img
                    src={`http://localhost:4000/${cita.imagen}`}
                    alt="Imagen adjunta a la cita"
                    width="300"
                  />
                )}
              </span>
              <span className="cita-estado">Estado de la cita: {cita.estado}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay citas programadas como paciente.</p>
      )}

      <h3>Citas como Especialista</h3>
      {citasComoEspecialista.length > 0 ? (
        <ul>
          {citasComoEspecialista.map((cita) => (
            <li key={cita.id} className="especialista-cita">
              <span className="cita-fecha">
                {formatDate(cita.fecha)} entre las {cita.hora} horas
              </span>
              <span className="cita-descripcion">{cita.descripcion}</span>
              <span className="cita-especialista">
                Especialista: {especialistas[cita.especialista_id] || 'Cargando...'}
              </span>
              {cita.imagen ? (
                <span style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  Imagen adjunta:{' '}
                </span>
              ) : (
                <div style={{ paddingTop: '5px' }}></div>
              )}
              <span className="cita-imagen">
                {cita.imagen && (
                  <img
                    src={`http://localhost:4000/${cita.imagen}`}
                    alt="Imagen adjunta a la cita"
                    width="300"
                  />
                )}
              </span>
              <span className="cita-estado">Estado de la cita: {cita.estado}</span>
              {/* Botones para editar y cancelar */}
              <div className="cita-acciones">
                <button onClick={() => handleEditCita(cita.id)}>Editar</button>
                <button onClick={() => handleCancelCita(cita.id)}>Cancelar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay citas programadas como especialista.</p>
      )}
    </div>
  );
};

export default MisCitas;
