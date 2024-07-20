import React from 'react';
import "../App.css";
import Formulario from './formulario-registro';
import { Link } from 'react-router-dom';

function Registro() {
    return(
    <>       
    {<Formulario />}        
    </>
    );
}

export default Registro;