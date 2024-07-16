import React from 'react';
import "../App.css";
import Formulario from './formularioCita.js';
import { Link } from 'react-router-dom';
import Cabecera from './Header';

function AgendarCita() {
    return(
    <>
    {<Cabecera />}
       
    {<Formulario />}
    </>
    );
}

export default AgendarCita;