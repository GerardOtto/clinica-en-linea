import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './agendarCita.css';

const AgendarCita = () => {
  const [fecha, setFecha] = useState('');
  const [informacionAdicional, setInformacionAdicional] = useState('');
  const [especialista, setEspecialista] = useState('');
  const [especialistas, setEspecialistas] = useState([]);
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState(''); // Estado para el mensaje
  const location = useLocation(); // Hook para obtener la ubicación actual

  useEffect(() => {
    fetchEspecialistas();
  }, []);

  useEffect(() => {
    // Leer parámetros de la URL
    const params = new URLSearchParams(location.search);
    const especialistaId = params.get('especialistaId');
    if (especialistaId) {
      setEspecialista(especialistaId);
    }
  }, [location.search]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const token = localStorage.getItem('token-sesion');
    console.log('Token de sesión:', token);
  
    if (!token) {
      setMensaje('Debe iniciar sesión primero');
      return; // Salir de la función si el token es nulo
    }

    if (!especialista) {
      newErrors.especialista = 'Por favor, seleccione un especialista';
    }
    if (!fecha) {
      newErrors.fecha = 'Por favor, seleccione una fecha';
    }
    if (!informacionAdicional) {
      newErrors.informacionAdicional = 'Por favor, ingrese información adicional';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await fetch('http://localhost:4000/agendarCita', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nombrePaciente: token, // Si el token no contiene el nombre del paciente, cámbialo por la información correcta
            fecha,
            descripcion: informacionAdicional,
            especialista_id: especialista
          })
        });

        if (!response.ok) {
          throw new Error('Error al agendar la cita');
        }

        const result = await response.json();
        console.log('Cita agendada correctamente:', result);
        setErrors({});
        alert('Solicitud realizada con éxito!');
        window.location.reload(); // REFRESCAR AQUI
      } catch (error) {
        console.error('Error al enviar la cita:', error);
      }
    }
  };

  return (
    <div className="agendar-cita">
      <h2>Agendar Cita</h2>
      {mensaje && <p className="mensaje-error">{mensaje}</p>} {/* Mostrar el mensaje si existe */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="especialista">Seleccione especialista:</label>
          <select
            id="especialista"
            value={especialista}
            onChange={(e) => setEspecialista(e.target.value)}
          >
            <option value="">Seleccione...</option>
            {especialistas.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nombre}
              </option>
            ))}
          </select>
          {errors.especialista && <span className="error-message">{errors.especialista}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="fecha">Seleccione una fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          {errors.fecha && <span className="error-message">{errors.fecha}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="informacionAdicional">Información adicional:</label>
          <textarea
            id="informacionAdicional"
            value={informacionAdicional}
            onChange={(e) => setInformacionAdicional(e.target.value)}
          />
          {errors.informacionAdicional && <span className="error-message">{errors.informacionAdicional}</span>}
        </div>
        <button type="submit">Solicitar cita</button>
      </form>
    </div>
  );
};

export default AgendarCita;
