import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './agendarCita.css';

const AgendarCita = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [informacionAdicional, setInformacionAdicional] = useState('');
  const [especialista, setEspecialista] = useState('');
  const [especialistas, setEspecialistas] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagen, setImagen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token-sesion');
    if (!token) {
      navigate('/login'); // Redirigir al usuario a la página de login si no hay token de sesión
    } else {
      fetchEspecialistas();
    }
  }, [navigate]);

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

    if (!especialista) {
      newErrors.especialista = 'Por favor, seleccione un especialista';
    }
    if (!fecha) {
      newErrors.fecha = 'Por favor, seleccione una fecha';
    }
    if (!hora) {
      newErrors.hora = 'Por favor, seleccione una hora';
    }
    if (!informacionAdicional) {
      newErrors.informacionAdicional = 'Por favor, ingrese información adicional';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const formData = new FormData();
        formData.append('rutPaciente', token);
        formData.append('fecha', fecha);
        formData.append('hora', hora);
        formData.append('descripcion', informacionAdicional);
        formData.append('especialista_id', especialista);
        if (imagen) {
          formData.append('imagen', imagen);
        }
        formData.append('estado', 'Pendiente');

        const response = await fetch('http://localhost:4000/agendarCita', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Error al agendar la cita');
        }

        const result = await response.json();
        console.log('Cita agendada correctamente:', result);
        setErrors({});
        alert('Solicitud realizada con éxito!');
        window.location.reload();
      } catch (error) {
        console.error('Error al enviar la cita:', error);
      }
    }
  };

  return (
    <div className="agendar-cita">
      <h2>Agendar Cita</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <label htmlFor="hora">Seleccione una hora:</label>
          <select
            id="hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="08:00-09:00">08:00 - 09:00</option>
            <option value="09:00-10:00">09:00 - 10:00</option>
            <option value="10:00-11:00">10:00 - 11:00</option>
            <option value="11:00-12:00">11:00 - 12:00</option>
            <option value="12:00-13:00">12:00 - 13:00</option>
            <option value="13:00-14:00">13:00 - 14:00</option>
            <option value="14:00-15:00">14:00 - 15:00</option>
            <option value="15:00-16:00">15:00 - 16:00</option>
            <option value="16:00-17:00">16:00 - 17:00</option>
            <option value="17:00-18:00">17:00 - 18:00</option>
          </select>
          {errors.hora && <span className="error-message">{errors.hora}</span>}
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
        <div className="form-group">
          <label htmlFor="imagen">Adjuntar Imagen:</label>
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </div>
        <button type="submit">Solicitar cita</button>
      </form>
    </div>
  );
};

export default AgendarCita;
