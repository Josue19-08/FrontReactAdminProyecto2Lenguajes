import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './GestionCupones.css';
import sinImagen from '../../img/sinImagen.png';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const API_CUPON_URL = 'http://localhost/PlataformaCuponesPHP/Backend%20PHP/Presentacion/CuponController.php';
const API_PROMOCION_URL = 'http://localhost/PlataformaCuponesPHP/Backend%20PHP/Presentacion/PromocionController.php';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
};

function GestionCupones() {
  const { empresaId } = useParams();
  const [cupones, setCupones] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCupon, setSelectedCupon] = useState(null);

  const fetchCupones = useCallback(async () => {
    try {
      const response = await fetch(`${API_CUPON_URL}?empresa_id=${empresaId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCupones(data);
    } catch (error) {
      console.error('Error fetching cupones:', error);
    }
  }, [empresaId]);

  const fetchPromociones = useCallback(async (cuponId) => {
    try {
      const response = await fetch(`${API_PROMOCION_URL}?cupon_id=${cuponId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPromociones(data);
    } catch (error) {
      console.error('Error fetching promociones:', error);
    }
  }, []);

  useEffect(() => {
    fetchCupones();
  }, [fetchCupones]);

  const updateCuponEstado = async (cupon, estado) => {
    const updatedCupon = { ...cupon, estado };
    try {
      const dataToSend = {
        METHOD: 'PUT',
        cupon: updatedCupon // Asegúrate de que el objeto 'cupon' contenga los datos correctos
      };

      console.log('Datos que se envían:', JSON.stringify(dataToSend, null, 2));

      const response = await fetch(API_CUPON_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        fetchCupones();
      } else {
        const errorData = await response.json();
        console.error('Error updating cupon:', errorData);
        alert('Error actualizando el estado del cupón');
      }
    } catch (error) {
      console.error('Error updating cupon:', error);
      alert('Error actualizando el estado del cupón');
    }
  };

  const eliminarPromocion = async (id) => {
    const dataToSend = {
      METHOD: 'DELETE',
      id: id
    };

    console.log('Datos que se envían para eliminar promoción:', JSON.stringify(dataToSend, null, 2));

    try {
      const response = await fetch(API_PROMOCION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      alert(result.message);
      fetchPromociones(selectedCupon.id);
    } catch (error) {
      console.error('Error eliminando la promoción:', error);
      alert('Hubo un error al eliminar la promoción');
    }
  };

  const openModal = (cupon) => {
    setSelectedCupon(cupon);
    fetchPromociones(cupon.id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setPromociones([]);
  };

  return (
    <div className="gestion-cupones-container">
      <h1>Gestión de Cupones</h1>
      <div className="cupones-list">
        {cupones.map(cupon => (
          <div 
            key={cupon.id} 
            className={`cupon ${cupon.estado === 'Activo' ? 'cupon-activo' : 'cupon-inactivo'}`}
          >
            <img src={cupon.imagen || sinImagen} alt={cupon.nombre} className="cupon-imagen" />
            <h2>{cupon.nombre}</h2>
            <label>Código:</label>
            <input type="text" value={cupon.codigo} readOnly />
            <label>Precio:</label>
            <input type="number" value={cupon.precio} readOnly />
            <label>Estado:</label>
            <input type="text" value={cupon.estado} readOnly />
            <label>Categoría:</label>
            <input type="text" value={cupon.categoria_id} readOnly />
            <label>Fecha Inicio:</label>
            <input type="date" value={cupon.fecha_inicio} readOnly />
            <label>Fecha Vencimiento:</label>
            <input type="date" value={cupon.fecha_vencimiento} readOnly />
            <label>Fecha Creación:</label>
            <input type="date" value={cupon.fecha_creacion} readOnly />
            <label>Imagen:</label>
            <input type="text" value={cupon.imagen} readOnly />
            <div className="cupon-buttons">
              <button onClick={() => updateCuponEstado(cupon, 'Activo')}>Habilitar</button>
              <button onClick={() => updateCuponEstado(cupon, 'Inactivo')}>Deshabilitar</button>
              <button onClick={() => openModal(cupon)}>Promociones activas</button>
              
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="modal-overlay"
      >
        <Box sx={{ ...style, width: 600 }} className="modal">
          <ul>
            <Typography variant="h6" component="h2" id="parent-modal-title">
              Promociones activas para {selectedCupon && selectedCupon.nombre}
            </Typography>
            {promociones.map(promocion => (
              <li key={promocion.id} style={{ marginBottom: '20px' }}>
                <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#fff' }}>
                  <Typography variant="body1"><strong>Descripción:</strong> {promocion.descripcion}</Typography>
                  <Typography variant="body2"><strong>Fecha Inicio:</strong> {promocion.fecha_inicio}</Typography>
                  <Typography variant="body2"><strong>Fecha Vencimiento:</strong> {promocion.fecha_vencimiento}</Typography>
                  <Typography variant="body2"><strong>Descuento:</strong> {promocion.descuento}%</Typography>
                  <Button onClick={() => eliminarPromocion(promocion.id)} sx={{ width: '100%', marginTop: '10px' }} className="modal-button">Eliminar Promoción</Button>
                </Box>
              </li>
            ))}
          </ul>
        </Box>
      </Modal>
    </div>
  );
}

export default GestionCupones;
