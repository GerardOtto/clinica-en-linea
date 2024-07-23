import React, { useState } from 'react';
import './formulario-registro.css';
import { Link, useNavigate } from 'react-router-dom';

const Formulario = () => {
  const [rutPaciente, setrutPaciente] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleIngresar = async (event) => {
    event.preventDefault(); // Evita la recarga de la página
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
            const token = 'your-token'; // Este es el token que deseas almacenar
            localStorage.setItem('token', token);
            alert('Inicio de sesión exitoso como ADMIN!');
          }
          alert('Inicio de sesión exitoso!');
          const sesion = data.rutPaciente; // Asume que el rut del usuario viene en la respuesta
          localStorage.setItem('token-sesion', sesion);
          console.log('Token de sesión:', sesion);
          window.location.reload(); // REFRESCAR AQUI
        } else {
          alert('Los datos de inicio de sesión no coinciden');
        }        
      } catch (error) {
        console.error(error);
        alert('Ocurrió un error al comunicarse con el servidor');
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'rutPaciente') {
      setrutPaciente(value);
    } else if (name === 'contrasena') {
      setContrasena(value);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleIngresar(event);
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
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
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
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          {errors.contrasenaError && (
            <span className="error-message">{errors.contrasenaError}</span>
          )}
        </div>
        <button
          type="submit"
          id="ingresar"
          name="ingresar"
          style={{ marginRight: '5px' }}
        >
          Ingresar
        </button>
        <Link to={'/recuperarClave'}>
          <button type="submit" id="botonRecuperar" name="botonRecuperar">
            Recuperar clave
          </button>
        </Link>
      </form>
    </div>
  );
};

export default Formulario;
