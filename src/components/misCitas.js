import React, { useState, useEffect } from 'react';
import { useNavigate, redirect } from 'react-router-dom';
import Modal from './modal2'; // Importar el componente Modal
import './misCitas.css';

const MisCitas = () => {
  const [citasComoPaciente, setCitasComoPaciente] = useState([]);
  const [citasComoEspecialista, setCitasComoEspecialista] = useState([]);
  const [especialistas, setEspecialistas] = useState({});
  const [editCita, setEditCita] = useState(null);
  const [formValues, setFormValues] = useState({
    rutPaciente: '',
    fecha: '',
    hora: '',
    descripcion: '',
    especialista_id: '',
    estado: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

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
  const handleEditCita = (cita) => {
    setEditCita(cita);
    setFormValues(cita);
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/citas/${editCita.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedCita = await response.json();
      setCitasComoEspecialista(citasComoEspecialista.map(cita => (cita.id === updatedCita.id ? updatedCita : cita)));
      setEditCita(null);
      setShowEditModal(false);
      fetchCitas(); // Refrescar la lista de citas
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
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
              <button className="button" onClick={() => handleEditCita(cita)}>
                Editar cita
              </button>
              <button className="button" onClick={() => handleCancelCita(cita.id)}>
                Cancelar cita
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay citas programadas como especialista.</p>
      )}

      {/* Modal para edición de cita */}
      {showEditModal && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <form className="formulario-modificacion-cita" onSubmit={handleFormSubmit}>
            <h2>Editar Cita</h2>
            
              <label>Rut Paciente:
                <input
                  type="text"
                  name="rutPaciente"
                  value={formValues.rutPaciente}
                  onChange={handleInputChange}
                  required
                />
              </label>
            
              <label>Fecha:
              <input
                type="date"
                name="fecha"
                value={formValues.fecha}
                onChange={handleInputChange}
                required
              />
              </label>
            
            
              <label>Hora:
              <input
                type="text"
                name="hora"
                value={formValues.hora}
                onChange={handleInputChange}
                required
              />
              </label>
            
            
              <label>Descripción:
              <textarea
                name="descripcion"
                value={formValues.descripcion}
                onChange={handleInputChange}
                required
              />
              </label>
            
            
              <label>Especialista ID:
              <input
                type="text"
                name="especialista_id"
                value={formValues.especialista_id}
                onChange={handleInputChange}
                required
              />
              </label>
            
              <label>Estado:
              <select
                name="estado"
                value={formValues.estado}
                onChange={handleInputChange}
                required
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Realizada</option>
                <option value="Paciente-no-asiste">Paciente no asiste</option>
                <option value="Cancelada">Cancelada</option>
              </select>
              </label>
            
            <button type="submit">Guardar Cambios</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MisCitas;
