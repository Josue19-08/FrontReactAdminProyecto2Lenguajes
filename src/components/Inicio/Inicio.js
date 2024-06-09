import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';

const API_EMPRESA_URL = 'http://localhost:8080/PlataformaCuponesPHP/Backend%20PHP/Presentacion/EmpresaController.php';

function Inicio() {
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();
  let [empresaActualizar, setEmpresaActualizar] = useState([]);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const response = await fetch(API_EMPRESA_URL);
      const data = await response.json();
      setEmpresas(data);
    } catch (error) {
      console.error('Error fetching empresas:', error);
    }
  };

  const updateEmpresaEstado = async (empresa, estado) => {
    const updatedEmpresa = { ...empresa, estado };
    try {
      const response = await fetch(API_EMPRESA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedEmpresa, METHOD: 'PUT' }),
      });

      if (response.ok) {
        fetchEmpresas();
      } else {
        const errorData = await response.json();
        console.error('Error updating empresa:', errorData);
        alert('Error actualizando el estado de la empresa');
      }
    } catch (error) {
      console.error('Error updating empresa:', error);
      alert('Error actualizando el estado de la empresa');
    }
  };

  const goToGestionCupones = (empresaId) => {
    navigate(`/gestion-cupones/${empresaId}`);
  };

  return (
    <div className="inicio-container">
      <h1>Lista de Empresas</h1>
      <div className="empresas-container">
        {empresas.map((empresa) => (

          <div key={empresa.id} className={`empresa-card ${empresa.estado.toLowerCase()}`}>
            <img src={empresa.imagen} alt={empresa.nombre} className="empresa-imagen" />
            <div className="empresa-info">
              <label>Nombre:</label>
              <input type="text" value={empresa.nombre} readOnly/>
              <label>Dirección:</label>
              <input type="text" value={empresa.direccion} readOnly />
              <label>Cédula:</label>
              <input type="text" value={empresa.cedula} readOnly />
              <label>Fecha de Creación:</label>
              <input type="text" value={empresa.fecha_creacion} readOnly />
              <label>Correo:</label>
              <input type="text" value={empresa.correo} readOnly />
              <label>Teléfono:</label>
              <input type="text" value={empresa.telefono} readOnly />
              <div className="empresa-buttons">
                <button onClick={() => updateEmpresaEstado(empresa, 'Activo')}>Habilitar</button>
                <button onClick={() => updateEmpresaEstado(empresa, 'Inactivo')}>Inhabilitar</button>
                <button onClick={() => goToGestionCupones(empresa.id)}>Cupones Publicados</button>
                <button>Actualizar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inicio;
