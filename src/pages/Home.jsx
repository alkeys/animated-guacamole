import Header from "../component/Header.jsx";
import DatosMetorologicos from "../component/DatosMetorologicos.jsx";
import Clima from "../component/Clima.jsx";
import Tiempografica from "./Tiempografica.jsx";
import Mapameteorologico from "../component/Mapameteorologico.jsx";
import {useEffect} from "react";
import {useState} from "react";
import { agregarMedicion } from "../Service/Firebase/Crudfirebase.js";
import {
    HuemdadDHT,
    MediaTempDhtBmp,
    ObtenerVelicidad,
    PresionBMP,
    LatitudGPS,
    LongitudGPS,
    ObtenerData,
    EstadoConexion,
    ValorTor, EstadoTor
} from "../Service/DataControler.js";
import {Descargadoc} from "../component/Descargadoc.jsx";
import {Animacionxd} from "../component/Animacionxd.jsx";


const Home = () => {
    const [ActivarPantalla, setActivarPantalla] = useState("Pantalla1");
    const [showSnackbar, setShowSnackbar] = useState(true);
    const [mobile, setMobile] = useState(false);
    /**
     * funcion para guardar datos en la base de datos cada 30 minutos
     */


    
    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
 setMobile(isMobile)
        var isConnected = EstadoConexion();
        console.log(isMobile)
        isConnected = false
        console.log(isConnected)
        if (isMobile || !isConnected ) return console.log("En mobile no carga datos o no estas conectado!"); 
        console.log("ENVIADOS")
        const interval = setInterval(() => {
            const data = {
                temperature: MediaTempDhtBmp().toFixed(2),
                pressure: PresionBMP().toFixed(2),
                humidity: HuemdadDHT(),
                windSpeed: ObtenerVelicidad(),
                latitude: LatitudGPS(),
                longitude: LongitudGPS(),
                timestamps: [],
            };
            console.log("Se ha subido")
            agregarMedicion(getDate(), getHour(), data)
        }, 3000); //1800000=30 minutos


        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const valorlluvia = EstadoTor(); // "tor":{"E_ll":false,"V_ll":0}}
        if (valorlluvia) {
            setShowSnackbar(true);
        } else {
            setShowSnackbar(false);
        }
    }, []);

    const handleScreen = (Screen) => {
        setActivarPantalla(Screen);
    }



    return (
        <div className="headerxd">

            <Header mobile={mobile} handleScreen={handleScreen}/>
            {showSnackbar===true &&  <Animacionxd></Animacionxd>}

            {ActivarPantalla === "Pantalla1" && <Pantalla1/>}¡
            {ActivarPantalla === "Pantalla2" && <Pantalla2/>}
            {ActivarPantalla === "Pantalla3" && <Pantalla3/>}


            {showSnackbar && (
                <div
                    className="fixed bottom-4 right-4 flex items-center px-4 py-2 space-x-2 bg-blue-500/90 text-white text-sm rounded-lg shadow-lg transition-transform transform-gpu translate-y-0 animate-fade-in">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-blue-200"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.5-5.25a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zm.75 3a.75.75 0 10-1.5 0v2.5a.75.75 0 101.5 0V9.75zm-.75 5a.75.75 0 100 1.5.75.75 0 000-1.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Lloviendo</span>
                    <Animacionxd></Animacionxd>
                </div>
            )}

        </div>
    );
}

const Pantalla1 = () => (
    <div>

        <div id={"pantalla1"} className="text-blue-600 text-2xl font-bold flex flex-row space-y-3 h-full mt-8">
            <DatosMetorologicos/>
            <Clima/>
        </div>
    </div>

);


const Pantalla2 = () => (
    <div id={"pantalla2"} className="text-blue-600 text-2xl font-bold  space-y-3 h-full">
        <Descargadoc idElemento="pantalla2" Nombrepdf="Datos"/>
        <Tiempografica></Tiempografica>
    </div>
    )
;

const Pantalla3 = () => (
    <div id={"pantalla3"} className="text-blue-600 text-2xl font-bold  space-y-3 h-full">
        <Mapameteorologico></Mapameteorologico>
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