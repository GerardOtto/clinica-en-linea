import React, { Component } from 'react';
import './formulario-registro.css';

class FormularioRegistro extends Component {
  state = {
    nombre: '',
    email: '',
    contrasena: '',
    recontrasena: '',
    telefono: '',
    errors: {},
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { nombre, email, contrasena, recontrasena, telefono } = this.state;
    const errors = {};

    if (nombre.trim() === '') {
      errors.nombreError = 'Por favor, ingresa tu nombre';
    }

    if (!this.validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.emailError = 'Por favor, ingresa un correo electrónico válido';
    }

    if (!this.validateField(contrasena, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.*[^\w\s]).{8,}$/)) {
      errors.contrasenaError =
        'La contraseña debe contener al menos una minúscula, una mayúscula, un número, un carácter especial y un largo mínimo de 8 caracteres';
    }

    if (contrasena !== recontrasena) {
      errors.recontrasenaError = 'Las contraseñas no coinciden';
    }

    if (!this.validateField(telefono, /^\d{9}$/)) {
      errors.telefonoError = 'Por favor, ingresa un número de teléfono válido (9 dígitos)';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      try {
        const response = await fetch('http://localhost:4000/crearUsuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre,
            email,
            contrasena,
            telefono,
          }),
        });

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error('Respuesta no es un JSON válido: ' + text);
        }

        if (!response.ok) {
          throw new Error(data.message || 'Error al crear usuario');
        }

        console.log('Registro exitoso:', data);

        alert('Registro exitoso! (Datos añadidos a la BASE DE DATOS)');
        // Restablecer el formulario
        this.setState({
          nombre: '',
          email: '',
          contrasena: '',
          recontrasena: '',
          telefono: '',
          errors: {},
        });
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        alert('Error al intentar registrarse: ' + error.message);
      }
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  validateField = (value, regex) => {
    return regex.test(value);
  };

  render() {
    const { nombre, email, contrasena, recontrasena, telefono, errors } = this.state;

    return (
      <div className="formulario-registro">
        <form id="registro" name="registro" noValidate onSubmit={this.handleSubmit}>
          <h2>Registro</h2>
          <div>
            <label htmlFor="nombre">Nombre completo:</label>
            <input type="text" id="nombre" name="nombre" value={nombre} onChange={this.handleInputChange} />
            {errors.nombreError && <span className="error-message">{errors.nombreError}</span>}
          </div>
          <div>
            <label htmlFor="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" value={email} onChange={this.handleInputChange} />
            {errors.emailError && <span className="error-message">{errors.emailError}</span>}
          </div>
          <div>
            <label htmlFor="contrasena">Contraseña:</label>
            <input type="password" id="contrasena" name="contrasena" value={contrasena} onChange={this.handleInputChange} />
            {errors.contrasenaError && <span className="error-message">{errors.contrasenaError}</span>}
          </div>
          <div>
            <label htmlFor="recontrasena">Confirmación de la contraseña:</label>
            <input type="password" id="recontrasena" name="recontrasena" value={recontrasena} onChange={this.handleInputChange} />
            {errors.recontrasenaError && <span className="error-message">{errors.recontrasenaError}</span>}
          </div>
          <div>
            <label htmlFor="telefono">Teléfono de contacto:</label>
            <input type="text" id="telefono" name="telefono" value={telefono} onChange={this.handleInputChange} />
            {errors.telefonoError && <span className="error-message">{errors.telefonoError}</span>}
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    );
  }
}

export default FormularioRegistro;
