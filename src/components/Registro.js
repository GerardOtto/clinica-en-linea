import React from 'react';
import "../App.css";
import Formulario from './formulario-registro';
import { Link } from 'react-router-dom';
import Cabecera from './Header';

function Registro() {
    return(
    <>
    {<Cabecera />}
        
    {<Formulario />}        
    </>
    );
}

export default Registro;