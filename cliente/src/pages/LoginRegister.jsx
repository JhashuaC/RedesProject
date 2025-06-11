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
    setCedula('');
    setPassword('');
    setNombre('');
    setPrimerApellido('');
    setSegundoApellido('');
    setNumero('');
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
        setUsuarioLogueado(data.usuario);
      } else {
        setMensaje(data.message || 'Error en la operación');
      }
    } catch (e) {
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1E3F] px-4">
      <div className="bg-[#112B54] rounded-xl shadow-lg max-w-md w-full p-8 text-white">
        <h2 className="text-3xl font-semibold mb-6 text-center select-none">
          {modo === 'login' ? 'Iniciar Sesión' : 'Registro'}
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={toggleModo}
            className="text-[#74A9D8] hover:text-[#A3C1E0] transition-colors duration-300 font-medium underline focus:outline-none"
            aria-label="Cambiar entre modo login y registro"
          >
            {modo === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-5"
          noValidate
        >
          <InputText
            placeholder="Cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            autoFocus
          />
          <InputText
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {modo === 'register' && (
            <>
              <InputText
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <InputText
                placeholder="Primer Apellido"
                value={primerApellido}
                onChange={(e) => setPrimerApellido(e.target.value)}
              />
              <InputText
                placeholder="Segundo Apellido (opcional)"
                value={segundoApellido}
                onChange={(e) => setSegundoApellido(e.target.value)}
              />
              <InputText
                placeholder="Número (8 dígitos)"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                maxLength={8}
              />
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#1F3A73] hover:bg-[#2951A3] transition-colors rounded-lg text-lg font-semibold"
          >
            {modo === 'login' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        {mensaje && (
          <p className="mt-5 text-center text-red-500 font-medium select-none">
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};

const InputText = ({ type = 'text', placeholder, value, onChange, autoFocus = false, maxLength }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    maxLength={maxLength}
    autoFocus={autoFocus}
    onChange={onChange}
    className="
      w-full
      rounded-md
      px-4
      py-3
      bg-[#153164]
      border border-[#2C4E8C]
      placeholder-[#8AA8D1]
      text-white
      focus:outline-none
      focus:ring-2
      focus:ring-[#3A5BA0]
      transition
      duration-300
      shadow-sm
      selection:bg-[#2C4E8C]
      selection:text-white
    "
  />
);

export default LoginRegister;
