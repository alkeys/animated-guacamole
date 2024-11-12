import React, { useState, useEffect } from "react";
import {EstadoConexion} from "../Service/DataControler.js";
const ConnectionStatus = () => {
    const [isConnected, setIsConnected] = useState(false);

    // Simula la conexión cambiando el estado cada 1 segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setIsConnected(EstadoConexion());
        }, 1000);

        // Limpiar el intervalo cuando el componente se desmonta
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hidden sm:block md:block flex items-center space-x-2">
            {isConnected ? (
                <>
                    <span className="material-icons text-green-500">check_circle</span>
                    <p className="text-green-500 font-semibold">Conectado</p>
                </>
            ) : (
                <>
                    <span className="material-icons text-yellow-500 animate-spin">autorenew</span>
                    <p className="text-yellow-500 font-semibold">Conectando...</p>
                </>
            )}
        </div>
    );
};

export default ConnectionStatus;
