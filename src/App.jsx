import './App.css';
import Header from "./component/Header.jsx";
import DatosMetorologicos from "./component/DatosMetorologicos.jsx";
import Clima from "./component/Clima.jsx";
import Carga from "./component/Carga.jsx";

function App() {
    // Generar gotas de lluvia aleatorias
    const createRainDrops = (numberOfDrops) => {
        const drops = [];
        for (let i = 0; i < numberOfDrops; i++) {
            drops.push(
                <div
                    className="drop"
                    style={{
                        left: `${Math.random() * 100}vw`, // Posición horizontal aleatoria
                        animationDuration: `${Math.random() * 0.5 + 0.5}s`, // Duración aleatoria de la animación
                        animationDelay: `${Math.random() * 5}s`, // Retraso aleatorio
                    }}
                    key={i}
                ></div>
            );
        }
        return drops;
    };

    return (
        <>
            <div className="headerxd">
                <Header />

                <div className="cards">
                    <DatosMetorologicos />
                    <Clima />
                </div>
            </div>

        </>
    );
}

export default App;
