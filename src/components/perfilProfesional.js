import React from 'react';
import './perfilProfesional.css';
import { Link } from 'react-router-dom';
import Cabecera from './Header';
import iconoWhatsapp from './whatsapp-icono.svg';

const Profile = () => {
  return (
    <>
    {<Cabecera />}
    <div className="profile-container">
      <main className="profile-content">
        <div className="image-section"
        style={{ width: "30%",
            border: "1px solid #ccc",
            padding: "20px",
            textAlign: 'center'}}>
          <p>Imagen del profesional</p>
        </div>
        <div className="info-section">
          <h2>Nombre</h2>
          <p>Descripción de la persona, contacto, especialidad y horario de atención</p>
          <p>
            Nullam at justo felis. Phasellus posuere eu metus ut congue. Praesent
            posuere, magna nec molestie imperdiet, ante mi mattis tortor, nec
            aliquet mi magna at dui. Ut porta suscipit purus at elementum.
            Aliquam hendrerit ex vel metus semper pretium. Fusce facilisis leo
            et sapien volutpat pulvinar. Vivamus interdum rhoncus odio. In
            rutrum felis eget ligula imperdiet, at luctus nibh accumsan. Donec
            vel tempus quam, vel porta turpis. Etiam nec enim placerat, suscipit
            mauris ut, sodales nisl.
          </p>
        </div>
      </main>
      <footer className="profile-footer">
        <button className="footer-button">Agendar</button>
        <Link to="https://mail.google.com/mail/u/lee@example.org/?view=cm&to=correoProfesional@example.com&su=Consulta Cafan&body=Por favor ingrese su consulta y sus datos para que el especialista se ponga en contacto con usted.&bcc=correoAdmin@example.com">
          <button className="footer-button">Enviar correo (Gmail)</button>
        </Link>
        <Link to="https://wa.me/56975348882?text=Hola! Me gustaría solicitar información sobre su disponibilidad para una consulta">
          <button className="footer-button">Consulta directa (Whatsapp)</button>
        </Link>
      </footer>
    </div>
    </>
  );
};

export default Profile;
