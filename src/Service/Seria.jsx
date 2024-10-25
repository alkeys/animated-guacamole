import React, { useEffect, useState } from 'react';

function SerialConnection() {
    const [port, setPort] = useState(null);  // Guarda el puerto seleccionado
    const [isConnected, setIsConnected] = useState(false);  // Estado de conexión
    const [data, setData] = useState('');  // Datos recibidos

    // Función para conectarse al puerto serial
    const connectSerial = async () => {
        try {
            const selectedPort = await navigator.serial.requestPort();
            await selectedPort.open({ baudRate: 115200 });
            setPort(selectedPort);
            setIsConnected(true);

            const decoder = new TextDecoderStream();
            const inputDone = selectedPort.readable.pipeTo(decoder.writable);
            const inputStream = decoder.readable;
            const reader = inputStream.getReader();

            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    break; // Si el puerto se cierra, se termina el bucle
                }
                if (value) {
                    setData(prevData => prevData + value);  // Actualiza el estado con los datos recibidos
                }
            }
        } catch (error) {
            console.error('Error en la conexión serial:', error);
        }
    };

    // Guarda los datos en localStorage cada vez que cambian
    useEffect(() => {
        if (data) {
            localStorage.setItem('serialData', data);
        }
    }, [data]);

    // Borrar datos cada segundo
    useEffect(() => {
        const intervalId = setInterval(() => {
            setData('');  // Borra los datos cada 1 segundo
        }, 1000);

        // Limpia el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, []);

    // Desconecta el puerto cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (port && port.close) {
                port.close();
            }
        };
    }, [port]);

    return (
        <div>
            <button
                className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition"
                onClick={connectSerial} disabled={isConnected}
            >
                {isConnected ? 'Conectado' : 'Conectar'}
            </button>
        </div>
    );
}

export default SerialConnection;
