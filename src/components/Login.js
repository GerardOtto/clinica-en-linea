import React from 'react';
import "../App.css";
import Formulario from './formulario-login';
import { Link } from 'react-router-dom';
import Cabecera from './Header';

function Login() {
    return(
    <>
    {<Cabecera />}
       
    {<Formulario />}
    </>
    );
}

export default Login;