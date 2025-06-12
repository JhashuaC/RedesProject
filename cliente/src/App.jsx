import { useState } from 'react';
import LoginRegister from './pages/LoginRegister';
import SinpePage from './pages/SinpePage';   //no entiendo por que da error pero bueno

const App = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const handleLogout = () => {
    setUsuarioLogueado(null);
    // También aquí podrías limpiar tokens o datos en localStorage si implementas persistencia
  };

  return (
    <>
      {usuarioLogueado ? (
        <SinpePage usuario={usuarioLogueado} onLogout={handleLogout} />
      ) : (
        <LoginRegister setUsuarioLogueado={setUsuarioLogueado} />
      )}
    </>
  );
};

export default App;
