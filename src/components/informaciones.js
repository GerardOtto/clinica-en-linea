import React, { useState, useEffect } from 'react';
import './informaciones.css'; // Asegúrate de tener este archivo con los estilos aplicados

const Informacion = ({ isAdmin }) => {
  const [informacion, setInformacion] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchInformacion = async () => {
      try {
        const response = await fetch('http://localhost:4000/informacion');
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error al obtener la información:', errorText);
          return;
        }
        const data = await response.json();
        setInformacion(data);
      } catch (error) {
        console.error('Error al obtener la información:', error);
      }
    };

    fetchInformacion();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:4000/informacion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(informacion),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al actualizar la información:', errorText);
        return;
      }
      alert('Información actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la información:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!file) {
      alert('Por favor selecciona una imagen.');
      return;
    }
    
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('id', '1'); // Asegúrate de agregar el ID adecuado

    try {
      const response = await fetch('http://localhost:4000/subirImagenInformacion', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al subir la imagen:', errorText);
        return;
      }
      const data = await response.json();
      alert('Imagen actualizada con éxito');
      setInformacion((prev) => ({ ...prev, imagen: `uploads/${data.path}` }));
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  if (!informacion) return <p>Cargando...</p>;

  return (
    <div className="quienes-somos">
      <h1>Información sobre el centro de atención</h1>
      <div className="contenido">
        <div className="info-contenido">
          <div className="texto1">
            <h2>Sobre nosotros...</h2>
            <p>{informacion.textoPrincipal}</p>
          </div>
          <div className="imagen">
            <img src={`http://localhost:4000/${informacion.imagen}`} alt="Imagen" />
          </div>
        </div>
        <div className="texto2">
          <h2>Correos y números de atención, contacto institucional, de negocios y dudas sobre la página:</h2>
          <p>{informacion.textoInferior}</p>
        </div>
      </div>
      
      {isAdmin && (
        <div className="info-contenido">
          <div className="texto" style={{margin:"auto"}}>
            <h3>Modificar Información</h3>
            <textarea
              value={informacion.textoPrincipal}
              onChange={(e) => setInformacion({ ...informacion, textoPrincipal: e.target.value })}
            />
            <textarea
              value={informacion.textoInferior}
              onChange={(e) => setInformacion({ ...informacion, textoInferior: e.target.value })}
            />
            <button onClick={handleSave}>Guardar Cambios</button>
          </div>
          <div style={{margin:"auto"}}>
            <input
              type="file"
              onChange={handleFileChange}
            />
            <button onClick={handleImageUpload}>Subir Imagen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Informacion;
