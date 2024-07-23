import React from 'react';
import './informaciones.css';

const QuienesSomos = () => {
  return (
    <div className="quienes-somos">
      <div className="contenido">
        <section className="informacion">
          <h2>Nuestra misión / Información de la clínica</h2>
          <div className="info-contenido">
            <div className="texto">
              <h3>Texto de relleno:</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <div className="imagen">
              <p>Imagen del equipo de trabajo, logotipos, certificados, etcétera</p>
            </div>
          </div>
        </section>
        <section className="contacto">
          <h3>Correos de atención general y dudas sobre la página:</h3>
          <p>
            ClinicaAyuda@ejemplo.com, consultasclinicas@ejemplo.com, correonegocios@ejemplo.com
          </p>
          <h3>Números de contacto institucional, de negocios o atención general:</h3>
          <p>
            +56 9 1234 5678 ; +56 9 9876 5432
          </p>
        </section>
      </div>
    </div>
  );
};

export default QuienesSomos;
