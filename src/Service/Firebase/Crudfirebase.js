import { getDoc,doc,getDocs, setDoc, deleteDoc ,collection} from "firebase/firestore";
import { db } from "./FirebaseService.js";


export const agregarDocumento = async (nombreColeccion, id, datos) => {
    //
    try {
        const docRef = doc(db, nombreColeccion, id); // Define la referencia del documento con el ID específico
        await setDoc(docRef, datos); // Utiliza setDoc para crear el documento con el ID dado
        console.log("Documento agregado con ID: ", id);
    } catch (error) {
        console.error("Error al agregar el documento: ", error);
        return 
    }
};

export const agregarMedicion = async (fecha, hora, medicion) => {
    try {
      // Ruta al documento de la fecha y subcolección de mediciones
      console.log(fecha, hora, medicion)
      const docRefSaved = doc(db, `Data/${fecha}/valores/${hora}`);
      const docRefLastUpdate = doc(db, "Data", "lastUpdate")
      await setDoc(docRefSaved, medicion);
      await setDoc(docRefLastUpdate, medicion);
      
      console.log("Medición agregada exitosamente");
    } catch (error) {
      console.error("Error al agregar la medición:", error);
      return
    }
  }
  


export const actualizarDocumento = async (nombreColeccion, id, datos) => {
    //
    try {
        await setDoc(doc(db, nombreColeccion, id), datos);
        console.log("Documento actualizado con ID: ", id);
    } catch (error) {
        console.error("Error al actualizar el documento: ", error);
    }
}

export const eliminarDocumento = async (nombreColeccion, id) => {
    //
    try {
        await deleteDoc(doc(db, nombreColeccion, id));
        console.log("Documento eliminado con ID: ", id);
    } catch (error) {
        console.error("Error al eliminar el documento: ", error);
    }

}

export const obtenerDocumentos = async (nombreColeccion, id) => {
    //
    try {
        const docRef = doc(db, nombreColeccion, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Datos del documento: ", docSnap.data());
            return docSnap.data(); // Return the document data
        } else {
            console.log("No hay datos en el documento");
            return null; // Return null if no data
        }
    } catch (error) {
        console.error("Error al obtener el documento: ", error);
        return null; // Return null in case of error
    }

}


export  const obtenerDocumentosall= async (nombreColeccion) => {
    //
    try {
        const querySnapshot = await getDocs(collection(db, nombreColeccion));
        const data = {
            timestamps: [],
            temperature: [],
            pressure: [],
            humidity: [],
            windSpeed: []
          };
        querySnapshot.forEach((doc) => {
            const medicion  = doc.data();
            data.timestamps.push(doc.id); // La marca de tiempo es el ID del documento
            data.temperature.push(medicion.temperature);
            data.pressure.push(medicion.pressure);
            data.humidity.push(medicion.humidity);
            data.windSpeed.push(medicion.windSpeed);
            
        });
        console.log("Documentos: ", data);
    ;
    } catch (error) {
        console.error("Error al obtener los documentos: ", error);
        return null;
    }
}