import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './administrarCitas.css';

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
  const [zoomedImg, setZoomedImg] = useState(null); // Estado para la imagen en zoom
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
    document.getElementById('edit-form').style.display = 'block'; // Mostrar el formulario de edición
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
      document.getElementById('edit-form').style.display = 'none'; // Ocultar el formulario de edición
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

  // Función para generar el archivo TXT y descargarlo
  const handleDownloadTxt = () => {
    const headers = ['ID', 'Paciente', 'Fecha', 'Hora', 'Descripción', 'Especialista', 'Estado'];
    const rows = citas.map(cita => [
      cita.id,
      cita.rutPaciente,
      formatDate(cita.fecha),
      cita.hora,
      cita.descripcion,
      getEspecialistaNombre(cita.especialista_id),
      cita.estado
    ]);

    let txtContent = [headers, ...rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "citas.txt");
    document.body.appendChild(link); // Required for FF
    link.click();
    URL.revokeObjectURL(url); // Clean up
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
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Descripción</th>
              <th>Especialista</th>
              <th>Imagen <br></br> (Presione para ampliar)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.rutPaciente}</td>
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

      {editCita && (
        <div id="edit-form" className="edit-form" style={{ display: 'none' }}>
          <h2>Modificar Cita</h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              Paciente:
              <input type="text" name="rutPaciente" value={formValues.rutPaciente} onChange={handleInputChange} />
            </label>
            <label>
              Fecha:
              <input type="date" name="fecha" value={formValues.fecha} onChange={handleInputChange} />
            </label>
            <label>
              Hora:
              <input type="text" name="hora" value={formValues.hora} onChange={handleInputChange} placeholder="Ingrese la hora" />
            </label>
            <label>
              Descripción:
              <input type="text" name="descripcion" value={formValues.descripcion} onChange={handleInputChange} />
            </label>
            <label>
              Especialista:
              <select name="especialista_id" value={formValues.especialista_id} onChange={handleInputChange}>
                {especialistas.map((especialista) => (
                  <option key={especialista.id} value={especialista.id}>
                    {especialista.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Estado:
              <select name="estado" value={formValues.estado} onChange={handleInputChange}>
                <option value="pendiente">Pendiente</option>
                <option value="realizada">Realizada</option>
                <option value="pacienteNoAsiste">Paciente no asiste</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </label>
            <button type="submit">Guardar cambios</button>
          </form>
        </div>
      )}

      {zoomedImg && (
        <div className="zoom-container">
          <img src={zoomedImg} alt="Imagen ampliada" className="zoom-img-large" onClick={() => setZoomedImg(null)} />
        </div>
      )}

      <button onClick={handleDownloadTxt} className="download-button">Presione aquí para descargar todas las citas</button>
      <button onClick={handleDeleteAll} className="delete-all-button">Eliminar Todas las Citas</button>
      <center style={{color:"darkRed"}}>Recuerde descargar todos los registros antes de eliminar los datos, pues esta acción es irreversible.</center>
    </div>  
);
};

export default VerCitas;
