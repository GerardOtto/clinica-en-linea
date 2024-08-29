import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import "../App.css";
import './administrarEspecialistas.css';
import './modal.css'; // Importa los estilos del modal
import { Link } from 'react-router-dom';

function ListarEspecialistas({ inSesion }) {
  const [especialistas, setEspecialistas] = useState([]);
  const [selectedEspecialista, setSelectedEspecialista] = useState(null);
  const [editData, setEditData] = useState({
    id: '',
    nombre: '',
    rut: '',
    contacto: '',
    horarioAtencion: '',
    correo: '',
    especialidad: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Hook para redirección

  useEffect(() => {
    // Verifica el token
    const token = localStorage.getItem('token-sesion') || inSesion;
    if (token !== '20969557k') {
      navigate('/'); // Redirige al usuario si el token no es válido
    } else {
      fetchEspecialistas();
    }
  }, [inSesion, navigate]);

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

  const eliminarEspecialista = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/eliminarEspecialista/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar especialista');
      }
      await fetchEspecialistas();
    } catch (error) {
      console.error('Error al eliminar especialista:', error);
    }
  };

  const handleImageChange = async (event, especialista) => {
    const imagen = event.target.files[0];
    if (!imagen) return;

    setSelectedEspecialista(especialista);

    const formData = new FormData();
    formData.append('imagen', imagen);

    try {
      const response = await fetch(`http://localhost:4000/subirImagen/${especialista.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const result = await response.json();
      alert(result.message);
      await fetchEspecialistas(); // Refresca la lista de especialistas
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleEditClick = (especialista) => {
    setEditData({
      id: especialista.id,
      nombre: especialista.nombre,
      rut: especialista.rutEspecialista,
      contacto: especialista.contacto,
      horarioAtencion: especialista.horarioAtencion,
      correo: especialista.correo,
      especialidad: especialista.especialidad,
    });
    setIsModalOpen(true); // Abrir el modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/modificarEspecialista/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Error al modificar especialista');
      }

      const result = await response.json();
      alert(result.message);
      await fetchEspecialistas();
      setIsModalOpen(false); // Cerrar el modal después de guardar cambios
      setEditData({
        id: '',
        nombre: '',
        rut: '',
        contacto: '',
        horarioAtencion: '',
        correo: '',
        especialidad: ''
      });
    } catch (error) {
      console.error('Error al modificar especialista:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="list-container">
      <h2>Listado de Especialistas</h2>
      <table className="styled-table">
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Contacto</th>
            <th>Horario de Atención</th>
            <th>Correo</th>
            <th>Especialidad</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {especialistas.map((especialista) => (
            <tr key={especialista.id}>
              <td>{especialista.id}</td>
              <td>{especialista.nombre}</td>
              <td>{especialista.rutEspecialista}</td>
              <td>{especialista.contacto}</td>
              <td>{especialista.horarioAtencion}</td>
              <td>{especialista.correo}</td>
              <td>{especialista.especialidad}</td>
              <td>
                {especialista.imagen && (
                  <img src={`http://localhost:4000/${especialista.imagen}`} alt="Imagen de perfil" width="50" />
                )}
                <label className="custom-file-input">
                  <input type="file" onChange={(event) => handleImageChange(event, especialista)} />
                </label>
              </td>
              <td>
                <button
                  onClick={() => eliminarEspecialista(especialista.id)}
                  className="delete-button"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleEditClick(especialista)}
                  className="edit-button"
                >
                  Modificar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={'/anadirEspecialista'}><button>Añadir especialistas</button></Link>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleEditSubmit} className="edit-form">
              <button className="close-button" onClick={closeModal}>X</button>
              <h2>Modificar Especialista</h2>
              <label>
                Nombre:
                <input type="text" name="nombre" value={editData.nombre} onChange={handleInputChange} />
              </label>
              
              <label>
                RUT:
                <input type="text" name="rut" value={editData.rut} onChange={handleInputChange} />
              </label>
              <label>
                Contacto:
                <input type="text" name="contacto" value={editData.contacto} onChange={handleInputChange} />
              </label>
              <label>
                Horario de Atención:
                <input type="text" name="horarioAtencion" value={editData.horarioAtencion} onChange={handleInputChange} />
              </label>
              <label>
                Correo:
                <input type="text" name="correo" value={editData.correo} onChange={handleInputChange} />
              </label>
              <label>
                Especialidad:
                <input type="text" name="especialidad" value={editData.especialidad} onChange={handleInputChange} />
              </label>
              <button type="submit">Guardar cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListarEspecialistas;
