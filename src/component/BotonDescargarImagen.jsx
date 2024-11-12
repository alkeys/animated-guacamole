// BotonDescargarImagen.jsx
import React from "react";
import html2canvas from "html2canvas";

const BotonDescargarImagen = ({ idElemento,nombreImg }) => {
  const descargarImagen = () => {
    const elemento = document.getElementById(idElemento);
    html2canvas(elemento).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      const concatenar = nombreImg + ".png";
      link.download = concatenar;
      link.click();
    });
  };

  return (
<button
  onClick={descargarImagen}
className="rounded-md shadow-md px-4 py-1 bg-gradient-to-r from-blue-400 to-blue-200
         hover:shadow-lg transition-transform transform hover:scale-105
         active:scale-95 active:shadow-sm text-sm"
>
  Descargar Imagen
</button>

  );
};

export default BotonDescargarImagen;

