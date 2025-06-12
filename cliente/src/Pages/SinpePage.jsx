import { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'; // Requiere Lucide para íconos

const SinpePage = ({ usuario, onLogout }) => {
    const [destinatario, setDestinatario] = useState('');
    const [monto, setMonto] = useState('');
    const [detalle, setDetalle] = useState('');
    const [keyEmisor, setKeyEmisor] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [historial, setHistorial] = useState([]);
    const [montoUsuario, setMontoUsuario] = useState(null);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Obtener historial de transacciones
                const responseHist = await fetch(`/api/logs?numero=${usuario.numero}`);
                const dataHist = await responseHist.json();
                if (responseHist.ok) setHistorial(dataHist || []);
                else setMensaje('Error al cargar historial');

                // Obtener monto actual del usuario
                const responseMonto = await fetch(`/api/usuario?numero=${usuario.numero}`);
                const dataMonto = await responseMonto.json();
                if (responseMonto.ok) setMontoUsuario(dataMonto.usuario_monto);
                else setMontoUsuario(null);
            } catch {
                setMensaje('Error de conexión con el servidor');
            }
        };
        fetchDatos();
    }, [usuario.numero]);

    const handleEnviar = async () => {
        if (!destinatario || !monto || parseFloat(monto) <= 0 || destinatario.length !== 8 || !keyEmisor) {
            setMensaje('Verifique que todos los campos estén correctos y que haya ingresado la clave');
            return;
        }

        try {
            const response = await fetch('/api/enviar-sinpe', {             //ENVIAR SINPE
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    num_emisor: usuario.numero,
                    key_emisor: keyEmisor,
                    num_receptor: destinatario,
                    monto: parseFloat(monto),
                    detalle: detalle || 'Sin detalle'
                })
            });

            const data = await response.json();

            if (data.status === 'OK') {
                setMensaje('✅ Transacción exitosa');
                setDestinatario('');
                setMonto('');
                setDetalle('');
                setKeyEmisor('');

                // Actualizar historial
                const responseHist = await fetch(`/api/logs?numero=${usuario.numero}`);
                if (responseHist.ok) {
                    const newHist = await responseHist.json();
                    setHistorial(newHist);
                }

                // Actualizar monto actual
                const responseMonto = await fetch(`/api/usuario?numero=${usuario.numero}`);
                if (responseMonto.ok) {
                    const newMonto = await responseMonto.json();
                    setMontoUsuario(newMonto.usuario_monto);
                }
            } else {
                setMensaje('❌ ' + (data.message || 'Error al enviar'));
            }
        } catch {
            setMensaje('❌ Error de conexión con el servidor');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1E3F] p-6 text-white max-w-full mx-auto">
            <h1 className="text-6xl font-extrabold text-white select-none text-center">JMJ</h1>

            {montoUsuario !== null && (
                <p className="text-center text-xl font-semibold mt-2 text-[#8AA8D1] select-none">
                    Saldo actual: ₡{parseFloat(montoUsuario).toLocaleString('es-CR')}
                </p>
            )}

            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-semibold select-none">Bienvenido, {usuario.nombre}</h2>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-red-700 hover:bg-red-800 transition-colors px-4 py-2 rounded font-semibold"
                >
                    Cerrar sesión
                </button>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-5 select-none">Enviar SINPE</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputText
                        placeholder="Número destinatario (8 dígitos)"
                        value={destinatario}
                        onChange={e => setDestinatario(e.target.value)}
                    />
                    <InputText
                        type="number"
                        placeholder="Monto ₡"
                        value={monto}
                        onChange={e => setMonto(e.target.value)}
                    />
                    <InputText
                        placeholder="Detalle / Comentario"
                        value={detalle}
                        onChange={e => setDetalle(e.target.value)}
                    />
                    <InputText
                        type="password"
                        placeholder="Clave de emisor"
                        value={keyEmisor}
                        onChange={e => setKeyEmisor(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleEnviar}
                    className="mt-6 bg-[#1F3A73] hover:bg-[#2951A3] transition-colors rounded-lg px-8 py-3 font-semibold"
                >
                    Enviar
                </button>
                {mensaje && (
                    <p
                        className={`mt-4 text-center font-medium ${
                            mensaje.startsWith('✅') ? 'text-green-400' : 'text-red-500'
                        } select-none`}
                    >
                        {mensaje}
                    </p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-5 select-none">Historial de transacciones</h2>
                {historial.length === 0 ? (
                    <p className="text-[#8AA8D1] select-none">No hay transacciones aún.</p>
                ) : (
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="border-b border-[#2C4E8C] p-3">Fecha</th>
                                <th className="border-b border-[#2C4E8C] p-3">Destino</th>
                                <th className="border-b border-[#2C4E8C] p-3">Detalle</th>
                                <th className="border-b border-[#2C4E8C] p-3">Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.map((t, i) => {
                                const estado = t.estado_transaccion?.toUpperCase() || '';
                                let icono = '❓';

                                if (estado.includes('ENVÍO INTERNO')) {
                                    icono = '⬆️';
                                } else if (estado.includes('RECEPCIÓN INTERNA')) {
                                    icono = '⬇️';
                                } else if (estado.includes('RECEPCIÓN EXTERNA')) {
                                    icono = '🌐';
                                } else if (estado.includes('EXITOSA')) {
                                    icono = '✅';
                                } else if (estado.includes('TRANSACCION RECHAZA')) {
                                    icono = '❌';
                                }
                                return (
                                    <tr
                                        key={i}
                                        className="hover:bg-[#153164] transition-colors duration-200 cursor-default select-none"
                                    >
                                        <td className="border-b border-[#2C4E8C] p-3">
                                            {t.fecha_transaccion ? new Date(t.fecha_transaccion).toLocaleString() : '-'}
                                        </td>
                                        <td className="border-b border-[#2C4E8C] p-3">{t.numero_receptor || '-'}</td>
                                        <td className="border-b border-[#2C4E8C] p-3">{t.detalle || '-'}</td>
                                        <td className="border-b border-[#2C4E8C] p-3 font-semibold flex items-center">
                                            {icono} <span className="ml-1">{estado}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

const InputText = ({ type = 'text', placeholder, value, onChange }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
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

export default SinpePage;
