import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { LoginPage } from './indexPages'
function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  return (
    <>
      <LoginPage setUsuarioLogueado={setUsuarioLogueado}></LoginPage>
    </>
  )
}

export default App
