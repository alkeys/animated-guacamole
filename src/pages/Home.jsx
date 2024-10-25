import Header from "../component/Header.jsx";
import DatosMetorologicos from "../component/DatosMetorologicos.jsx";
import Clima from "../component/Clima.jsx";
import Tiempografica from "./Tiempografica.jsx";
import Mapameteorologico from "../component/Mapameteorologico.jsx";

const Home = () => {
    return (
        <div className="headerxd">
            <Header/>
            <div className="cards">
                <DatosMetorologicos/>
                <Clima/>
            </div>
            <div>
                <Tiempografica></Tiempografica>
            </div>
            <Mapameteorologico></Mapameteorologico>
        </div>
    );
}

export default Home;