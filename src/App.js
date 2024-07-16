import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Login from './components/Login';
import Registro from './components/Registro';
import Perfil from './components/perfilProfesional';
import Perfiles from './components/profesionales';
import AgendarCita from './components/agendarCita';
import './App.css';

function App() {


  return (

    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfilPro" element={<Perfil />} />
        <Route path="/profesionales" element={<Perfiles />} />
        <Route path="/agendarCita" element={<AgendarCita />} />
{/* estas son las rutas para comunicarte entre paginas */}
      
      </Routes>
    </Router>
  );

}
export default App;
