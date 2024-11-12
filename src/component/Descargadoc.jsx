import BotonDescargarImagen from "./BotonDescargarImagen.jsx";
import BotonDescargarPDF from "./BotonDescargarPDF.jsx";


export function Descargadoc({idElemento,Nombrepdf}) {
    return (
        <div className="fixed top-4 right-4 flex flex-row space-y-2 h-auto w-64">
            <div className="relative group">
                <button className="bg-white text-blue-500 py-1 px-3 rounded hover:bg-gray-200 transition text-sm">
                    Descargar
                </button>
                <div
                    className="absolute right-0 mt-2 bg-blue-50 border border-gray-200 rounded flex flex-row
            shadow-lg opacity-0 group-hover:opacity-100 transition-opacity max-w-72">
                    <section className="mx-2 py-1 hover:bg-gray-100 transition">
                        <BotonDescargarImagen idElemento={idElemento} nombreImg={Nombrepdf}/>
                    </section>
                    <section className="mx-2 py-1 hover:bg-gray-100 transition">
                        <BotonDescargarPDF idElemento={idElemento} Nombrepdf={Nombrepdf}/>
                    </section>
                </div>
            </div>
        </div>
    )
}