import React, {useEffect, useState} from 'react';
import './style/rain.css';
import Seria from "../Service/Seria.jsx";
import Carga from "./Carga.jsx";


const Header = ( {handleScreen}) => {
    const [drops, setDrops] = useState([]);
    const [isRaining, setIsRaining] = useState(true); // Estado para controlar la lluvia

    useEffect(() => {
        const createRaindrops = () => {
            let raindrops = [];
            for (let i = 0; i < 100; i++) {
                raindrops.push(
                    <div
                        key={i}
                        className={`raindrop ${isRaining ? '' : 'stop'}`} // Clase para detener la lluvia
                        style={{
                            left: `${Math.random() * 100}vw`,
                            animationDuration: `${Math.random() * 1 + 1}s`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    ></div>
                );
            }
            setDrops(raindrops);
        };
        createRaindrops();
    }, [isRaining]); // Re-crea las gotas de lluvia si isRaining cambia


    // Controlar la lluvia
    const handleMouseEnter = () => {
        setIsRaining(false); // Detiene la lluvia al pasar el mouse
    };

    const handleMouseLeave = () => {
        setIsRaining(true); // Reinicia la lluvia al salir el mouse
    };

    return (
        <header
            className="relative  p-8 text-center"
            onMouseEnter={handleMouseEnter} // Evento para detener la lluvia
            onMouseLeave={handleMouseLeave} // Evento para reiniciar la lluvia
        >
            <h1 className="text-4xl font-bold">Estacion Meteorologica</h1>
            <p className="text-lg">Proyecto de Arquitetura</p>
            <div className="rain-container">{drops}</div>

            <div className="mt-6 flex  justify-center space-x-4 z-10 relative">
                <div className={"botones"}>
                    <Seria></Seria>
                    <Carga></Carga>
                </div>
                <div className="botones  space-x-2">
                    <button className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition"
                            onClick={() => handleScreen("Pantalla1")}>Datos Meteorologicos
                    </button>
                    <button className="block bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition"
                            onClick={() => handleScreen("Pantalla2")}>Graficos
                    </button>
                    <button className="hidden sm:block md:block bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition"
                            onClick={() => handleScreen("Pantalla3")}>Mapas
                    </button>
                </div>
            </div>


        </header>
    );
};

export default Header;
