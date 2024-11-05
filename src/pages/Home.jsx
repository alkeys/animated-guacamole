import Header from "../component/Header.jsx";
import DatosMetorologicos from "../component/DatosMetorologicos.jsx";
import Clima from "../component/Clima.jsx";
import Tiempografica from "./Tiempografica.jsx";
import Mapameteorologico from "../component/Mapameteorologico.jsx";
import {useEffect} from "react";
import {useState} from "react";
const Home = () => {
    const [ActivarPantalla, setActivarPantalla] = useState(null);
    /**
     * funcion para guardar datos en la base de datos cada 30 minutos
     */
    useEffect(() => {
        const interval = setInterval(() => {

        }, 1800000); //1800000=30 minutos
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


export default Home;