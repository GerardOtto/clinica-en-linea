import React, { useState } from 'react';
import "../App.css";
import { Link } from 'react-router-dom';
import './formulario-registro.css'

function AnadirEspecialista() {
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    horarioAtencion: '',
    correo: '',
    especialidad: '' // Agregando el campo especialidad
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/crearEspecialista', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Especialista creado correctamente');
        setFormData({
          nombre: '',
          contacto: '',
          horarioAtencion: '',
          correo: '',
          especialidad: '' // Reiniciando el campo especialidad
        });
      } else {
        alert('Error al crear especialista');
      }
    } catch (error) {
      console.error('Error al crear especialista:', error);
      alert('Error al crear especialista');
    }
  };

  return (
    <div className="formulario-registro">
      <h2>Añadir especialista</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contacto">Contacto:</label>
          <input
            type="text"
            id="contacto"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="horarioAtencion">Horario de Atención:</label>
          <input
            type="text"
            id="horarioAtencion"
            name="horarioAtencion"
            value={formData.horarioAtencion}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="correo">Correo:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="especialidad">Especialidad:</label>
          <input
            type="text"
            id="especialidad"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Crear Especialista</button>
      </form>
      <Link to="/administrarEspecialistas"><button>Volver</button></Link>
    </div>
  );
}

export default AnadirEspecialista;
