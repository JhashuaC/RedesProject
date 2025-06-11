import { useState } from 'react';

const LoginRegister = ({ setUsuarioLogueado }) => {
  const [modo, setModo] = useState('login'); // 'login' o 'register'
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [numero, setNumero] = useState('');
  const [mensaje, setMensaje] = useState('');

  const toggleModo = () => {
    setMensaje('');
    setModo(modo === 'login' ? 'register' : 'login');
  };

  const handleSubmit = async () => {
    setMensaje('');
    if (!cedula || !password || (modo === 'register' && (!nombre || !primerApellido || !numero))) {
      setMensaje('Por favor, complete todos los campos requeridos');
      return;
    }

    const url = modo === 'login'
      ? '/api/login'
      : '/api/register';

    const body = modo === 'login'
      ? { cedula, password }
      : { cedula, password, nombre, primerApellido, segundoApellido, numero };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        // Aquí asumimos que el backend devuelve al usuario logueado con al menos número y nombre
        setUsuarioLogueado(data.usuario);
      } else {
        setMensaje(data.message || 'Error en la operación');
      }
    } catch (e) {
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">{modo === 'login' ? 'Iniciar Sesión' : 'Registro'}</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={toggleModo}
          className="text-blue-600 hover:underline"
        >
          {modo === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>

      <input
        type="text"
        placeholder="Cédula"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {modo === 'register' && (
        <>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Primer Apellido"
            value={primerApellido}
            onChange={(e) => setPrimerApellido(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Segundo Apellido (opcional)"
            value={segundoApellido}
            onChange={(e) => setSegundoApellido(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Número (8 dígitos)"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        {modo === 'login' ? 'Entrar' : 'Registrarse'}
      </button>

      {mensaje && <p className="mt-4 text-center text-red-600">{mensaje}</p>}
    </div>
  );
};

export default LoginRegister;
