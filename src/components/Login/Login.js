import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './Login.css';
import logo from '../../img/logo.png';

const API_USUARIO_URL = 'http://localhost:8080/PlataformaCuponesPHP/Backend%20PHP/Presentacion/UsuarioController.php';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const encryptedPassword = CryptoJS.SHA256(password).toString();
    
    try {
      const response = await fetch(`${API_USUARIO_URL}?action=auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          contrasena: encryptedPassword
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        navigate('/inicio');
      } else {
        alert(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      alert('Error en la autenticación');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1>Inicio de Sesión</h1>
        <form onSubmit={handleSubmit}>
          <label>Nombre de Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
