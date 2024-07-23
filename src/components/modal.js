import React from 'react';
import './modal.css'; // Asegúrate de que la ruta al archivo de estilos sea correcta

const Modal = ({ imageUrl, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <img src={imageUrl} alt="Imagen ampliada" />
      </div>
    </div>
  );
};

export default Modal;
