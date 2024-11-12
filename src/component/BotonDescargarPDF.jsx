import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BotonDescargarPDF = ({ idElemento,Nombrepdf }) => {
  const descargarPDF = () => {
    const elemento = document.getElementById(idElemento);
    
    html2canvas(elemento).then((canvas) => {
      const pdf = new jsPDF();
      const imgWidth = 190; // Ancho de la imagen en la página PDF
      const pageHeight = pdf.internal.pageSize.height+100; // Altura de la página en el PDF con márgenes
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Altura total de la imagen escalada
      
      let yPosition = 0; // Posición inicial de recorte
      let remainingHeight = imgHeight; // Altura restante de la imagen a procesar
      
      while (remainingHeight > 0) {
        // Crear un nuevo canvas temporal para recortar la sección visible en la página
        const canvasPage = document.createElement("canvas");
        canvasPage.width = canvas.width;
        canvasPage.height = (pageHeight * canvas.width) / imgWidth;

        const context = canvasPage.getContext("2d");
        context.drawImage(
          canvas,
          0, yPosition, // Posición de inicio en el canvas original
          canvas.width, canvasPage.height, // Tamaño de la sección a cortar
          0, 0, // Posición en el nuevo canvas
          canvas.width, canvasPage.height // Tamaño en el nuevo canvas
        );

        // Convertir el canvas temporal a una imagen
        const imgData = canvasPage.toDataURL("image/png");

        // Agregar la imagen al PDF
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, pageHeight);

        // Actualizar la altura restante y la posición de recorte
        remainingHeight -= pageHeight;
        yPosition += canvasPage.height; // Aumentar yPosition exactamente en la altura del canvasPage

        // Agregar una nueva página si queda imagen
        if (remainingHeight > 0) pdf.addPage();
      }

      pdf.save(Nombrepdf);
    });
  };

  return (
<button
  onClick={descargarPDF}
  className="rounded-md shadow-md px-4 py-1 bg-gradient-to-r from-blue-400 to-blue-200
         hover:shadow-lg transition-transform transform hover:scale-105
         active:scale-95 active:shadow-sm text-sm"
>
  Descargar PDF
</button>

  );
};

export default BotonDescargarPDF;


