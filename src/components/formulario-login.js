// Formulario.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './formulario-registro.css';

const Formulario = ({ onClose }) => {
  const [rutPaciente, setrutPaciente] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegistrarse = () => {
    onClose();
    navigate('/registro');
  };

  const handleIngresar = async (event) => {
    event.preventDefault();
    const errors = {};

    if (rutPaciente.trim() === '') {
      errors.rutPacienteError = 'Por favor, ingresa tu RUT';
    }

    if (contrasena.trim() === '') {
      errors.contrasenaError = 'La contraseña es obligatoria';
    } else if (
      contrasena.length < 8 ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.*[^\w\s]).{8,}$/.test(
        contrasena
      )
    ) {
      errors.contrasenaError =
        'La contraseña debe contener al menos una minúscula, una mayúscula, un número, un carácter especial y un largo mínimo de 8 caracteres';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      try {
        const response = await fetch('http://localhost:4000/verificar-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rutPaciente, contrasena }),
        });

        const data = await response.json();

        if (data.success) {
          if (rutPaciente === '20969557k' && contrasena === '$20969557Kk') {
            const token = 'your-token'; 
            localStorage.setItem('token', token);
            alert('Inicio de sesión exitoso como ADMIN!');
          }
          
          alert('Inicio de sesión exitoso!');
          const sesion = data.rutPaciente;
          localStorage.setItem('token-sesion', sesion);
          console.log('Token de sesión:', sesion);

          // Verificar si es especialista
          const especialistaResponse = await fetch('http://localhost:4000/verificar-especialista', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rutPaciente }),
          });

          const especialistaData = await especialistaResponse.json();

          if (especialistaData.isEspecialista) {
            localStorage.setItem('esEspecialista', especialistaData.idEspecialista);
            console.log('Usuario es especialista, ID:', especialistaData.idEspecialista);
            alert('Bienvenido especialista!');
          }

          window.location.reload();
          onClose(); // Cerrar el modal después del inicio de sesión exitoso
        } else {
          alert('Los datos de inicio de sesión no coinciden');
        }
      } catch (error) {
        console.error(error);
        alert('Ocurrió un error al comunicarse con el servidor');
      }
    }
  };

  return (
    <div className="formulario-registro">
      <h2>Ingrese sus datos para iniciar sesión.</h2>
      <form id="registro" name="registro" onSubmit={handleIngresar}>
        <div className="mb-3">
          <label htmlFor="rutPaciente" className="form-label">
            RUT
          </label>
          <input
            type="text"
            className="form-control"
            id="rutPaciente"
            name="rutPaciente"
            value={rutPaciente}
            onChange={(e) => setrutPaciente(e.target.value)}
          />
          {errors.rutPacienteError && (
            <span className="error-message">{errors.rutPacienteError}</span>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="contrasena" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="contrasena"
            name="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          {errors.contrasenaError && (
            <span className="error-message">{errors.contrasenaError}</span>
          )}
        </div>
        <div className='botones'>
          <div className='crearCuenta'>
            <button type="button" id="registrarse" name="registrarse" style={{height:"50px"}} onClick={handleRegistrarse}>
              Crear cuenta
            </button>
            <label className='textoBoton'>Si no tiene una cuenta, registrese aquí</label>
          </div>
          <button type="submit" id="ingresar" name="ingresar" style={{height:"50px",marginLeft:"10px"}}>
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Formulario;
