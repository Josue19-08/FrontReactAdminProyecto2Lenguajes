import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';

const API_EMPRESA_URL = 'http://localhost/PlataformaCuponesPHP/Backend%20PHP/Presentacion/EmpresaController.php';

function Inicio() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [modalActualizar, setModalActualizar] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresaSeleccionada(prevState => ({
      ...prevState,
      [name]: value
    }));
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

  const handleActualizar = async () => {
    if(validarEmpresa(empresaSeleccionada)){
      try {
        const response = await fetch(API_EMPRESA_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...empresaSeleccionada, METHOD: 'PUT' }),
        });
  
        if (response.ok) {
          fetchEmpresas();
          setModalActualizar(false);
        } else {
          const errorData = await response.json();
          console.error('Error updating empresa:', errorData);
          alert('Error actualizando la empresa');
        }
      } catch (error) {
        console.error('Error updating empresa:', error);
        alert('Error actualizando la empresa');
      }

    } 
  };

  const validarEmpresa = (empresa) => {
    if (!empresa.nombre) {
      alert('El nombre no debe estar vacío');
      return false;
    }
    if (!empresa.direccion) {
      alert('La dirección no debe de estar vacía');
      return false;
    }
    if (!empresa.cedula) {
      alert('La cedula no debe estar vacía');
      return false;
    }
    if (!empresa.correo) {
      alert('El correo no puede ser vacío');
      return false;
    }
    if (!empresa.telefono) {
      alert('El telefono no puede ser vacío ');
      return false;
    }
    return true;
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
              <input type="text" value={empresa.nombre} readOnly />
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
                <button onClick={() => { setModalActualizar(true); setEmpresaSeleccionada(empresa); }}>Actualizar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalActualizar && empresaSeleccionada && (
        <div className="modal" >
          <div className="modal-content">
            <h2>Actualizar Empresa</h2>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={empresaSeleccionada.nombre}
              onChange={handleChange}
              required
            />
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={empresaSeleccionada.direccion}
              onChange={handleChange}
              required
            />
            <label>Cédula:</label>
            <input
              type="text"
              name="cedula"
              value={empresaSeleccionada.cedula}
              onChange={handleChange}
              required
            />
            <label>Correo:</label>
            <input
              type="email"
              name="correo"
              value={empresaSeleccionada.correo}
              onChange={handleChange}
              required
            />
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={empresaSeleccionada.telefono}
              onChange={handleChange}
              required
            />
            <div className="modal-buttons">
              <button onClick={handleActualizar}>Actualizar</button>
              <button onClick={() => setModalActualizar(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inicio;
