import { useState, useEffect } from 'react';

const SinpePage = ({ usuario, onLogout }) => {
  const [destinatario, setDestinatario] = useState('');
  const [monto, setMonto] = useState('');
  const [detalle, setDetalle] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([]);

  // Cargar historial cuando el componente monta (puedes cambiar la URL)
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch(`/api/historial?numero=${usuario.numero}`);
        const data = await response.json();
        if (response.ok) {
          setHistorial(data.historial || []);
        } else {
          setMensaje('Error al cargar historial');
        }
      } catch {
        setMensaje('Error de conexión con el servidor');
      }
    };
    fetchHistorial();
  }, [usuario.numero]);

  const handleEnviar = async () => {
    if (!destinatario || !monto || parseFloat(monto) <= 0 || destinatario.length !== 8) {
      setMensaje('⚠️ Verifique que todos los campos estén correctos');
      return;
    }

    try {
      const response = await fetch('/api/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num_emisor: usuario.numero,
          num_destino: destinatario,
          monto,
          detalle
        })
      });
      const data = await response.json();

      if (data.status === 'OK') {
        setMensaje('✅ Transacción exitosa');
        setDestinatario('');
        setMonto('');
        setDetalle('');
        // Actualizar historial tras enviar
        setHistorial(prev => [{ num_destino: destinatario, monto, detalle, fecha: new Date().toISOString() }, ...prev]);
      } else {
        setMensaje('❌ ' + (data.message || 'Error al enviar'));
      }
    } catch {
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bienvenido, {usuario.nombre}</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Enviar dinero</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Número destinatario (8 dígitos)"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Monto ₡"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Detalle / Comentario"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleEnviar}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Enviar
        </button>
        {mensaje && <p className="mt-2 text-sm text-red-600">{mensaje}</p>}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Historial de transacciones</h2>
        {historial.length === 0 ? (
          <p className="text-gray-600">No hay transacciones aún.</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">Fecha</th>
                <th className="border-b border-gray-300 p-2">Destino</th>
                <th className="border-b border-gray-300 p-2">Monto</th>
                <th className="border-b border-gray-300 p-2">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((t, i) => (
                <tr key={i} className="hover:bg-gray-100">
                  <td className="border-b border-gray-200 p-2">{new Date(t.fecha).toLocaleString()}</td>
                  <td className="border-b border-gray-200 p-2">{t.num_destino}</td>
                  <td className="border-b border-gray-200 p-2">₡ {parseFloat(t.monto).toFixed(2)}</td>
                  <td className="border-b border-gray-200 p-2">{t.detalle || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default SinpePage;
