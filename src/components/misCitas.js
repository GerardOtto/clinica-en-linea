import React, { useState, useEffect } from 'react';
import { useNavigate, redirect } from 'react-router-dom';
import Modal from './modal2'; // Importar el componente Modal
import './misCitas.css';

const MisCitas = () => {
  const [citasComoPaciente, setCitasComoPaciente] = useState([]);
  const [citasComoEspecialista, setCitasComoEspecialista] = useState([]);
  const [citasCompletadas, setCitasCompletadas] = useState([]); // Estado para las citas completadas
  const [especialistas, setEspecialistas] = useState([]);
  const [editCita, setEditCita] = useState(null);
  const [formValues, setFormValues] = useState({
    rutPaciente: '',
    nombrePaciente: '',
    numeroPaciente: '',
    fecha: '',
    hora: '',
    descripcion: '',
    especialista_id: '',
    estado: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null); // Estado para manejar el zoom de la imagen
  const [isEspecialista, setIsEspecialista] = useState(false); // Estado para manejar el token 'esEspecialista'
  const navigate = useNavigate();

  useEffect(() => {
    fetchCitas();
    fetchEspecialistas(); // Obtener la lista de especialistas
  }, []);

  useEffect(() => {
    const tokenEspecialista = localStorage.getItem('esEspecialista');
    setIsEspecialista(!!tokenEspecialista); // Verificar si el token 'esEspecialista' está activo
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

  const fetchCitas = async () => {
    const tokenSesion = localStorage.getItem('token-sesion');
    const tokenEspecialista = localStorage.getItem('esEspecialista');
  
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
  
      const citasPaciente = data.filter((cita) => cita.rutPaciente === tokenSesion);
      const citasEspecialista = tokenEspecialista
        ? data.filter((cita) => cita.especialista_id.toString() === tokenEspecialista)
        : [];
  
      // Filtrar citas completadas que pertenecen al rutPaciente del token de sesión o al especialista
      const citasTerminadas = data.filter((cita) =>
        cita.estado === 'Terminada' &&
        (cita.rutPaciente === tokenSesion || cita.especialista_id.toString() === tokenEspecialista)
      );
  
      setCitasComoPaciente(citasPaciente);
      setCitasComoEspecialista(citasEspecialista);
      setCitasCompletadas(citasTerminadas); // Actualizar estado con citas completadas
    } catch (error) {
      console.error('Error al recuperar citas:', error);
    }
  };
  
  

  const formatToDateInput = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en formato de dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Día en formato de dos dígitos
    return `${year}-${month}-${day}`;
  };

  const handleEditCita = (cita) => {
    setEditCita(cita);
    setFormValues({
      ...cita,
      fecha: formatToDateInput(cita.fecha), // Usar el nuevo formato de fecha
    });
    setShowEditModal(true);
  };

  const formatToChileanDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('es-CL', options);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/citas/${editCita.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedCita = await response.json();
      setCitasComoEspecialista(citasComoEspecialista.map((cita) => (cita.id === updatedCita.id ? updatedCita : cita)));
      setEditCita(null);
      setShowEditModal(false);
      fetchCitas();
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };

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

      setCitasComoEspecialista((prevCitas) => prevCitas.filter((cita) => cita.id !== citaId));
      alert('Cita cancelada con éxito');
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      alert('Hubo un error al cancelar la cita. Por favor, inténtelo de nuevo.');
    }
  };

  const handleZoom = (imagen) => {
    setZoomedImage(imagen);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  return (
    <div className="mis-citas">
      <h2>Mis Citas</h2>

      {/* Lista de citas como paciente */}
      {citasComoPaciente.length > 0 ? (
        <ul>
          {citasComoPaciente.map((cita) => (
            <li key={cita.id}>
              <span className="cita-fecha">{formatToDateInput(cita.fecha)} entre las {cita.hora} horas</span>
              <span className="cita-descripcion">Descripción: {cita.descripcion}</span>
              <span className="cita-especialista">Especialista: {especialistas.find(e => e.id === cita.especialista_id)?.nombre || 'Cargando...'}</span>
              {cita.imagen ? (
                <span style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  Imagen adjunta (Click para hacer zoom):{' '}
                </span>
              ) : (
                <div style={{ paddingTop: '5px' }}></div>
              )}
              {cita.imagen && (
                <img
                  src={`http://localhost:4000/${cita.imagen}`}
                  alt="Imagen adjunta a la cita"
                  width="300"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleZoom(cita.imagen)}
                />
              )}
              <span className="cita-estado" style={{marginTop:"8px"}}>Estado de la cita: {cita.estado}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay citas programadas como paciente.</p>
      )}

      {/* Lista de citas como especialista */}
      {isEspecialista && (
        <>
          <h3>Citas como Especialista</h3>
          {citasComoEspecialista.length > 0 ? (
            <ul>
              {citasComoEspecialista.map((cita) => (
                <li key={cita.id} className="especialista-cita">
                  <span className="cita-fecha">{formatToChileanDate(cita.fecha)} entre las {cita.hora} horas</span>
                  <span className="cita-paciente" style={{marginBottom:"5px"}}>Nombre del paciente: {cita.nombrePaciente}</span>
                  <span className="cita-numero-paciente">Teléfono del paciente: {cita.numeroPaciente}</span>
                  <span className="cita-descripcion">Descripción: {cita.descripcion}</span>
                  <span className="cita-especialista">Especialista: {especialistas.find(e => e.id === cita.especialista_id)?.nombre || 'Cargando...'}</span>
                  {cita.imagen ? (
                    <span style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                      Imagen adjunta:{' '}
                    </span>
                  ) : (
                    <div style={{ paddingTop: '5px' }}></div>
                  )}
                  {cita.imagen && (
                    <img
                      src={`http://localhost:4000/${cita.imagen}`}
                      alt="Imagen adjunta a la cita"
                      width="300"
                      style={{ cursor: 'pointer', marginBottom:'10px' }}
                      onClick={() => handleZoom(cita.imagen)}
                    />
                  )}
                  <span className="cita-estado">Estado de la cita: {cita.estado}</span>
                  <button className="button" onClick={() => handleEditCita(cita)}>Editar cita</button>
                  <button className="button" onClick={() => handleCancelCita(cita.id)}>Cancelar cita</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay citas programadas como especialista.</p>
          )}
        </>
      )}

      {/* Lista de citas completadas */}
      <h3>Citas Completadas</h3>
      {citasCompletadas.length > 0 ? (
        <ul>
          {citasCompletadas.map((cita) => (
            <li key={cita.id} className="cita-completada">
              <span className="cita-paciente">Nombre del paciente: {cita.nombrePaciente}</span>
              <span className="cita-especialista">Especialista: {especialistas.find(e => e.id === cita.especialista_id)?.nombre || 'Cargando...'}</span>
              <span className="cita-fecha">Fecha: {formatToChileanDate(cita.fecha)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay citas completadas.</p>
      )}

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
                style={{marginBottom:"25px"}}
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

            <label>
              <p>Descripción:</p>
              <textarea
                placeholder="Ingrese datos y/o observaciones de la cita."
                name="descripcion"
                value={formValues.descripcion}
                onChange={handleInputChange}
              />
            </label>

            <label style={{paddingBottom:"20px"}}>Especialista:
              <select
                name="especialista_id"
                value={formValues.especialista_id}
                onChange={handleInputChange}
                required
                style={{marginLeft:"8px",height:"auto"}}
              >
                <option value="" disabled>Seleccione un especialista</option>
                {especialistas.map((especialista) => (
                  <option key={especialista.id} value={especialista.id}>
                    {especialista.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label>Estado:
              <select
                name="estado"
                value={formValues.estado}
                onChange={handleInputChange}
                required
                style={{marginLeft:"8px", height:"auto"}}
              >
                <option value="" disabled>Seleccione un estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="Anulada por paciente">Anulada por paciente</option>
                <option value="Paciente no asiste">Paciente no asiste</option>
                <option value="Aplazada">Aplazada</option>
                <option value="Terminada">Terminada</option>
              </select>
            </label>

            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>
          </form>
        </Modal>
      )}

      {zoomedImage && (
        <div className="zoomed-image-overlay" onClick={handleCloseZoom}>
          <div className="zoomed-image-container">
            <img src={`http://localhost:4000/${zoomedImage}`} alt="Zoomed Imagen" className="zoomed-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCitas;
