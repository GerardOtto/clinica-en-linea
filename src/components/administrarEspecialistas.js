import React, { useState, useEffect } from 'react';
import "../App.css";
import './administrarEspecialistas.css';
import { Link } from 'react-router-dom';

function ListarEspecialistas() {
  const [especialistas, setEspecialistas] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [selectedEspecialista, setSelectedEspecialista] = useState(null);

  useEffect(() => {
    fetchEspecialistas();
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

  const handleImageChange = (event, especialista) => {
    setImagen(event.target.files[0]);
    setSelectedEspecialista(especialista);
  };

  const subirImagen = async () => {
    if (!selectedEspecialista || !imagen) return;

    const formData = new FormData();
    formData.append('imagen', imagen);

    try {
      const response = await fetch(`http://localhost:4000/subirImagen/${selectedEspecialista.id}`, {
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

  return (
    <div className="list-container">
      <h2>Listado de Especialistas</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
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
              <td>{especialista.contacto}</td>
              <td>{especialista.horarioAtencion}</td>
              <td>{especialista.correo}</td>
              <td>{especialista.especialidad}</td>
              <td>
                {especialista.imagen && (
                  <img src={`http://localhost:4000/${especialista.imagen}`} alt="Imagen de perfil" width="50" />
                )}
                <input type="file" onChange={(event) => handleImageChange(event, especialista)} />
                <button onClick={subirImagen}>Subir Imagen</button>
              </td>
              <td>
                <button 
                  onClick={() => eliminarEspecialista(especialista.id)}
                  className="delete-button"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={'/anadirEspecialista'}><button>Añadir especialistas</button></Link>
    </div>
  );
}

export default ListarEspecialistas;
