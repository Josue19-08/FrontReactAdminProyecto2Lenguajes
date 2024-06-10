import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Inicio from './components/Inicio/Inicio';
import GestionCupones from './components/GestionCupones/GestionCupones';
import Layout from './components/Layout'; // Asegúrate de que esta ruta sea correcta
import CrearEmpresa from './components/CrearEmpresa/CrearEmpresa';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Layout><Inicio /></Layout>} />
        <Route path="/gestion-cupones/:empresaId" element={<Layout><GestionCupones /></Layout>} />
        <Route path="/crear-empresa" element={<Layout><CrearEmpresa /></Layout>} />
        
      </Routes>
    </Router>
  );
}

export default App;
