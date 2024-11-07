import Header from "../component/Header.jsx";
import DatosMetorologicos from "../component/DatosMetorologicos.jsx";
import Clima from "../component/Clima.jsx";
import Tiempografica from "./Tiempografica.jsx";
import Mapameteorologico from "../component/Mapameteorologico.jsx";
import {useEffect} from "react";
import {useState} from "react";
import { agregarMedicion } from "../Service/Firebase/Crudfirebase.js";
import { HuemdadDHT, MediaTempDhtBmp, ObtenerVelicidad, PresionBMP,LatitudGPS,LongitudGPS } from "../Service/DataControler.js";
import {EstadoConexion} from "../Service/DataControler.js";

const Home = () => {
    const [ActivarPantalla, setActivarPantalla] = useState("Pantalla1");
    /**
     * funcion para guardar datos en la base de datos cada 30 minutos
     */

    
    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isConnected = EstadoConexion();
        if (isMobile || !isConnected) return console.log("En mobile no carga datos o no estas conectado!"); 
        const interval = setInterval(() => {
            const data = {
                temperature: MediaTempDhtBmp().toFixed(2),
                pressure: PresionBMP().toFixed(2),
                humidity: HuemdadDHT(),
                windSpeed: ObtenerVelicidad(),
                latitude: LatitudGPS(),
                longitude: LongitudGPS()
            };
            agregarMedicion(getDate(), getHour(), data)
        }, 1800); //1800000=30 minutos
        return () => clearInterval(interval);
    }, []);

    const handleScreen = (Screen) => {
        setActivarPantalla(Screen);
    }

    return (
        <div className="headerxd">
            <Header handleScreen={handleScreen}/>
            {ActivarPantalla === "Pantalla1" && <Pantalla1  />}
            {ActivarPantalla === "Pantalla2" && <Pantalla2  />}
            {ActivarPantalla === "Pantalla3" && <Pantalla3  />}
            {ActivarPantalla === "Pantalla4" && <Pantalla4  />}

        </div>
    );
}

const Pantalla1 = () => (
    <div className="text-blue-600 text-2xl font-bold flex flex-row space-y-3 h-full">
        <DatosMetorologicos/>
        <Clima/>
    </div>
);


const Pantalla2 = () => (
    <div className="text-blue-600 text-2xl font-bold  space-y-3 h-full">
        <Tiempografica></Tiempografica>
    </div>
)
;

const Pantalla3 = () => (
    <div className="text-blue-600 text-2xl font-bold  space-y-3 h-full">
        <Mapameteorologico></Mapameteorologico>
    </div>
);

const Pantalla4 = () => (
    <div className="text-blue-600 text-2xl font-bold  space-y-3 h-full">
       <h1>Informes</h1>
    </div>
);

const getHour = () => {
      // Obtener la hora, los minutos y los segundos
    const fechaActual = new Date();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const segundos = fechaActual.getSeconds();
  

  // Formatear la fecha completa (día, mes, año)
    const Hour = `${horas}:${minutos}:${segundos}`;
    return Hour
}

const getDate = () => {
    const fechaActual = new Date();
    const day = fechaActual.getDay();
    const month = fechaActual.getMonth() + 1;
    const year = fechaActual.getFullYear();
    
    const date = `${day}-${month}-${year}`
    return date
}

export default Home;