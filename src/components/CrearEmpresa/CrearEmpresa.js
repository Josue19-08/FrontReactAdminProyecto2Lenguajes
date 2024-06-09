import React, { useState } from 'react';
import './CrearEmpresa.css';
import logo from '../../img/logo.png';
import CryptoJS from 'crypto-js';

const API_EMPRESA_URL = 'http://localhost:8080/PlataformaCuponesPHP/Backend%20PHP/Presentacion/EmpresaController.php';

function CrearEmpresa() {
    const [empresaACrear, setEmpresaACrear] = useState({
        nombre: '',
        direccion: '',
        cedula: '',
        fecha_creacion: '',
        correo: '',
        telefono: '',
        imagen: '',
        contrasenna: generarContrasenia(),
        estado: 'Activo'
    });

    const devolverEstadoInicial = {
        nombre: '',
        direccion: '',
        cedula: '',
        fecha_creacion: '',
        correo: '',
        telefono: '',
        imagen: '',
        contrasenna: generarContrasenia(),
        estado: 'Activo'
    };

    function generarContrasenia(length = 12) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
        let contra = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            contra += charset[randomIndex];
        }

        const contraEncriptada = CryptoJS.SHA256(contra).toString();
        return contraEncriptada;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpresaACrear(prevState => ({
            ...prevState,
            [name]: value
        }));
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
        if (!empresa.fecha_creacion) {
            alert('La fecha de creación no puede ser vacía');
            return false;
        }

        const fechaActual = new Date();
        const fechaCreacion = new Date(empresa.fecha_creacion);
        if (fechaCreacion > fechaActual) {
            alert('Inserte una fecha válida');
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
        if (!empresa.imagen) {
            alert('La imagen no puede estar vacía');
            return false;
        }
        return true;
    };

    const crearEmpresa = async () => {
        if (!validarEmpresa(empresaACrear)) {
            return;
        }

        const dataToSend = {
            METHOD: 'POST',
            ...empresaACrear
        };

        console.log('Datos que se envían:', JSON.stringify(dataToSend, null, 2));

        try {
            const response = await fetch(API_EMPRESA_URL, {
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
            alert("Empresa creada");

            setEmpresaACrear({
                ...devolverEstadoInicial,
                contrasenna: generarContrasenia()
            });

            
        } catch (error) {
            console.error('Error creando la empresa:', error);
            alert('Hubo un error al crear la empresa');
        }
    };

    return (
        <div className="inicio-container">
            <h1>Crear Empresa</h1>
            <div className="empresas-container">
                <div className="empresa-card">
                    <img src={logo} alt="Logo" className="empresa-imagen" />
                    <div className="empresa-info">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={empresaACrear.nombre}
                            onChange={handleChange}
                            required
                        />
                        <label>Dirección:</label>
                        <input
                            type="text"
                            name="direccion"
                            value={empresaACrear.direccion}
                            onChange={handleChange}
                        />
                        <label>Cédula:</label>
                        <input
                            type="text"
                            name="cedula"
                            value={empresaACrear.cedula}
                            onChange={handleChange}
                        />
                        <label>Fecha de Creación:</label>
                        <input
                            type="date"
                            name="fecha_creacion"
                            value={empresaACrear.fecha_creacion}
                            onChange={handleChange}
                        />
                        <label>Correo:</label>
                        <input
                            type="email"
                            name="correo"
                            value={empresaACrear.correo}
                            onChange={handleChange}
                        />
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            name="telefono"
                            value={empresaACrear.telefono}
                            onChange={handleChange}
                        />
                        <label>Imagen:</label>
                        <input
                            type="text"
                            name="imagen"
                            value={empresaACrear.imagen}
                            onChange={handleChange}
                        />
                        <div className="empresa-buttons">
                            <button onClick={crearEmpresa}>Crear</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrearEmpresa;
