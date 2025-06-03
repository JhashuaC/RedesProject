import { useState } from 'react';
import './PageLogin.css'; 
import { Button, TextField } from '../components/index.js';
import { useNavigate } from 'react-router-dom';
const PageLogin = ({setUsuarioLogueado }) =>{
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


  const handleLogin = async () => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        usuario_cedula: cedula, 
        usuario_password: password 
      })
    });

    const data = await response.json();

    if (!response.ok || data.status !== "OK") {
      setError("Credenciales incorrectas o error del servidor");
      return;
    }

    setUsuarioLogueado(data.usuario);
    navigate('/menu');

  } catch (error) {
    console.error(error);
    setError('No se pudo conectar al servidor');
  }
};


    return(
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <TextField
                label="Código"
                name="codigo"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ingrese su cédula"
            />
            <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
            />
            <Button
                buttonText="Login"
                onClick={handleLogin}
                styles="btn btn-primary"
            />
        </div>
    );
}
export default PageLogin;