import React from 'react';
import "../App.css";
import Formulario from './formulario-login';
import { Link } from 'react-router-dom';

function Login() {
    return(
    <>
       
    {<Formulario />}
    </>
    );
}

export default Login;