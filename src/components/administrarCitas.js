import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './administrarCitas.css';
import Modal from './modal2'; // Importar el componente Modal

const VerCitas = ({ inSesion }) => {
  const [citas, setCitas] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [editCita, setEditCita] = useState(null);
  const [formValues, setFormValues] = useState({
    rutPaciente: '',
    fecha: '',
    hora: '',
    descripcion: '',
    especialista_id: '',
    estado: '',
  });
  const [zoomedImg, setZoomedImg] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token-sesion') || inSesion;

    if (token !== '20969557k') {
      navigate('/'); // Redirigir al usuario si el token de inSesion es distinto a '20969557k'
    } else {
      fetchCitas();
      fetchEspecialistas();
    }
  }, [inSesion, navigate]);

  const fetchCitas = async () => {
    try {
      const response = await fetch('http://localhost:4000/misCitas');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Ordenar las citas por estado con las terminadas al final
      data.sort((a, b) => {
        const estados = ['Pendiente', 'Aprobada', 'Rechazada', 'Anulada por paciente', 'Paciente no asiste', 'Aplazada', 'Terminada'];
        return estados.indexOf(a.estado) - estados.indexOf(b.estado);
      });
      setCitas(data);
    } catch (error) {
      console.error('Error al recuperar las citas:', error);
    }
  };

  const fetchEspecialistas = async () => {
    try {
      const response = await fetch('http://localhost:4000/listarEspecialistas');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEspecialistas(data);
    } catch (error) {
      console.error('Error al recuperar los especialistas:', error);
    }
  };

  const getEspecialistaNombre = (id) => {
    const especialista = especialistas.find((esp) => esp.id === id);
    return especialista ? especialista.nombre : 'Desconocido';
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditClick = (cita) => {
    setEditCita(cita);
    setFormValues(cita);
    setShowEditModal(true); // Mostrar el modal de edición
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
      setCitas(citas.map(cita => (cita.id === updatedCita.id ? updatedCita : cita)));
      setEditCita(null);
      setShowEditModal(false); // Ocultar el modal de edición
      fetchCitas(); // Refrescar la lista de citas
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };

  const eliminarCita = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/eliminarCita/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar cita');
      }
      await fetchCitas(); // Refrescar la lista de citas después de eliminar
    } catch (error) {
      console.error('Error al eliminar cita:', error);
    }
  };

  // Función para eliminar todas las citas
  const handleDeleteAll = async () => {
    const confirmarPrimero = window.confirm('¿Está seguro de que desea eliminar todas las citas?');
    if (!confirmarPrimero) return;

    const confirmarSegundo = window.confirm('Esta acción es irreversible. ¿Está seguro?');
    if (!confirmarSegundo) return;

    try {
      const response = await fetch('http://localhost:4000/eliminarTodasCitas', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar todas las citas');
      }
      await fetchCitas(); // Refrescar la lista de citas después de eliminar
    } catch (error) {
      console.error('Error al eliminar todas las citas:', error);
    }
  };

  // Función para generar el archivo CSV y descargarlo
  const handleDownloadCsv = () => {
    const headers = ['ID', 'Rut paciente', 'Fecha', 'Hora', 'Descripción', 'Especialista', 'Estado'];
    const rows = citas.map(cita => [
      cita.id,
      cita.rutPaciente,
      formatDate(cita.fecha),
      cita.hora,
      cita.descripcion,
      getEspecialistaNombre(cita.especialista_id),
      cita.estado
    ]);

    // Convertir los datos a formato CSV, usando comas como separador
    let csvContent = [headers, ...rows].map(e => e.join(";")).join("\n");

    // Agregar un BOM (Byte Order Mark) para que Excel detecte la codificación UTF-8 correctamente
    csvContent = "\uFEFF" + csvContent;

    // Crear el Blob y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "citas.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    URL.revokeObjectURL(url); // Limpiar
  };

  return (
    <div className="ver-citas">
      <h2>Lista de todas las Citas</h2>
      
      {citas.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <table className="citas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Rut paciente</th>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Descripción</th>
              <th>Especialista</th>
              <th>Imagen <br /> (Presione para ampliar)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.rutPaciente}</td>
                <td>{cita.nombrePaciente}</td>
                <td>{formatDate(cita.fecha)}</td>
                <td>{cita.hora}</td>
                <td>{cita.descripcion}</td>
                <td>{getEspecialistaNombre(cita.especialista_id)}</td>
                <td>
                  {cita.imagen && (
                    <img
                      src={`http://localhost:4000/${cita.imagen}`}
                      alt="Imagen"
                      width="100"
                      className="zoom-img"
                      onClick={() => setZoomedImg(`http://localhost:4000/${cita.imagen}`)}
                    />
                  )}
                </td>
                <td>{cita.estado}</td>
                <td>
                  <button onClick={() => handleEditClick(cita)} className="edit-button">Modificar</button>
                  <button onClick={() => eliminarCita(cita.id)} className="delete-button">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {zoomedImg && (
        <div className="zoom-container">
          <img src={zoomedImg} alt="Imagen ampliada" className="zoom-img-large" onClick={() => setZoomedImg(null)} />
        </div>
      )}

      <button onClick={handleDownloadCsv} className="download-button">Presione aquí para descargar todas las citas</button>
      <button onClick={handleDeleteAll} className="delete-all-button">Eliminar Todas las Citas</button>
      <center style={{ color: "darkRed" }}>Recuerde descargar todos los registros antes de eliminar los datos, pues esta acción es irreversible.</center>
    </div>
  );
};

export default VerCitas;
