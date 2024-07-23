import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Login from './components/Login';
import Registro from './components/Registro';
import Perfil from './components/perfilProfesional';
import Perfiles from './components/profesionales';
import AgendarCita from './components/agendarCita';
import AnadirEspecialista from './components/anadirEspecialista';
import AdministrarEspecialistas from './components/administrarEspecialistas';
import MisCitas from './components/misCitas';
import AdministrarCitas from './components/administrarCitas'
import Informaciones from './components/informaciones'

import './App.css';

function App() {
  const [inSesion, setSesion] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const sesion = localStorage.getItem('token-sesion');
    if (sesion) {
      setSesion(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAdmin(true);
    }
  }, []);

  return (
    <Router>
      <Header inSesion={inSesion} isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfilPro/:id" element={<Perfil />} />
        <Route path="/profesionales" element={<Perfiles />} />
        <Route path="/agendarCita" element={<AgendarCita />} />
        <Route path="/anadirEspecialista" element={<AnadirEspecialista />} />
        <Route path="/administrarEspecialistas" element={<AdministrarEspecialistas />} />
        <Route path="/misCitas" element={<MisCitas />} />
        <Route path="/administrarCitas" element={isAdmin ? <AdministrarCitas isAdmin={isAdmin} /> : <Navigate to="/" />} />
        <Route path="/informaciones" element={<Informaciones />} />
        {/* estas son las rutas para comunicarte entre paginas */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
