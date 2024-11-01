import { getDoc,doc,getDocs, setDoc, deleteDoc ,collection} from "firebase/firestore/lite";
import { FirebaseConfig } from "./FirebaseService.js";


export const agregarDocumento = async (nombreColeccion, id, datos) => {
    const { db } = FirebaseConfig();
    try {
        const docRef = doc(db, nombreColeccion, id); // Define la referencia del documento con el ID específico
        await setDoc(docRef, datos); // Utiliza setDoc para crear el documento con el ID dado
        console.log("Documento agregado con ID: ", id);
    } catch (error) {
        console.error("Error al agregar el documento: ", error);
    }
};


export const actualizarDocumento = async (nombreColeccion, id, datos) => {
    const { db } = FirebaseConfig();
    try {
        await setDoc(doc(db, nombreColeccion, id), datos);
        console.log("Documento actualizado con ID: ", id);
    } catch (error) {
        console.error("Error al actualizar el documento: ", error);
    }
}

export const eliminarDocumento = async (nombreColeccion, id) => {
    const { db } = FirebaseConfig();
    try {
        await deleteDoc(doc(db, nombreColeccion, id));
        console.log("Documento eliminado con ID: ", id);
    } catch (error) {
        console.error("Error al eliminar el documento: ", error);
    }

}

export const obtenerDocumentos = async (nombreColeccion, id) => {
    const { db } = FirebaseConfig();
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
    const { db } = FirebaseConfig();
    try {
        const querySnapshot = await getDocs(collection(db, nombreColeccion));
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        console.log("Documentos: ", documents);
        return documents;
    } catch (error) {
        console.error("Error al obtener los documentos: ", error);
        return null;
    }
}