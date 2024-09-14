import React, { useState, useEffect } from 'react';
import './MainContent.css';

const MainContent = ({ isAdmin }) => {
  const [content, setContent] = useState({
    leftSidebarText: '',
    imageSectionText: '',
    mainText: '',
    footerText: '',
    secondFooter: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:4000/maincontent');
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error al obtener el contenido:', errorText);
          return;
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error al obtener el contenido:', error);
      }
    };

    fetchContent();
  }, []);

  const handleSaveText = async () => {
    try {
      const updatedContent = { ...content };
      const response = await fetch('http://localhost:4000/maincontent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al actualizar el texto:', errorText);
        return;
      }
      alert('Texto actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el texto:', error);
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
    formData.append('id', 1); // Asegúrate de pasar el ID correcto

    try {
      const response = await fetch('http://localhost:4000/subirImagenMainContent', {
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
      setContent((prev) => ({ ...prev, imageSectionText: `http://localhost:4000/uploads/${data.path}` }));
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  return (
    <main className="main-content">
      <div className="left-sidebar">
        <h2>Bienvenido a Cafan!</h2>
        <p>{content.leftSidebarText}</p>
        {isAdmin && (
          <textarea
            value={content.leftSidebarText}
            onChange={(e) => setContent({ ...content, leftSidebarText: e.target.value })}
          />
        )}
      </div>
      <div className="main-section">
        <div className="image-section">
          {content.imageSectionText && (
            <img src={`http://localhost:4000/uploads/${content.imageSectionText}`} alt="Imagen del contenido" />
          )}
          {isAdmin && (
            <>
              <input
                type="file"
                onChange={handleFileChange}
              />
              <button onClick={handleImageUpload}>Subir Imagen</button>
            </>
          )}
        </div>
        <div className="text-section">
          <h2>{content.mainText}</h2>
          {isAdmin && (
            <textarea
              value={content.mainText}
              onChange={(e) => setContent({ ...content, mainText: e.target.value })}
            />
          )}
        </div>
      </div>
      <div className="right-sidebar">
        <h2>Podría interesarte...</h2>
        <p>{content.footerText}</p>
        {isAdmin && (
          <textarea
            value={content.footerText}
            onChange={(e) => setContent({ ...content, footerText: e.target.value })}
          />
        )}
      </div>
      <div className="footer-section">
        <p>{content.secondFooter}</p>
        {isAdmin && (
          <textarea
            value={content.secondFooter}
            onChange={(e) => setContent({ ...content, secondFooter: e.target.value })}
          />
        )}
        {isAdmin && (
          <>
            <button onClick={handleSaveText}>Guardar Texto</button>
          </>
        )}
      </div>
    </main>
  );
}

export default MainContent;
