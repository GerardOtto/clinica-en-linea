import React from 'react';
import './MainContent.css';

const MainContent = () => {
  return (
    <>
      <main className="main-content">
        <div className="left-sidebar">
          <p>Texto de ejemplo</p>
        </div>
        <div className="main-section">
          <div className="image-section">
            <p>Espacio para imágenes o informaciones</p>
          </div>
          <div className="text-section">
            <h2>Texto de relleno:</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
        <div className="right-sidebar">
          <p>Fila de relleno</p>
          <p>Fila de relleno</p>
          <p>Fila de relleno</p>
          <p>Fila de relleno</p>
          <p>Fila de relleno</p>
          <p>Fila de relleno</p>
          <p>Fila de relleno</p>
          <p>Fila de relleno</p>
        </div>
        <div className="footer-section">
          <p>Redes sociales / Páginas adicionales</p>
        </div>
      </main>
    </>
  );
}

export default MainContent;
