import { boot } from "quasar/wrappers"; //se utiliza para inicializar configuraciones globales o plugins
import { initializeApp } from "firebase/app"; // inicializa la aplicación de Firebase con una configuración específica
import { getFirestore } from "firebase/firestore"; //para acceder a la base de datos Firestore de Firebase
import { VueFire } from "vuefire"; //para integrar Firebase con Vue de una manera más sencilla
import { getStorage } from "firebase/storage"; //para acceder al almacenamiento de Firebase, donde se guardan archivos como imágenes o documentos


// Objeto que contiene la configuración de Firebase necesaria para conectarse al proyecto de firebase
const firebaseConfig = {
    apiKey: "AIzaSyAOskJvVyYQXo1PZe8_C1sg6UtJ2kcUB7A", 
    authDomain: "estacion-meteorologica-b177a.firebaseapp.com", 
    projectId: "estacion-meteorologica-b177a", 
    storageBucket: "estacion-meteorologica-b177a.appspot.com",  
    messagingSenderId: "801826800977",  
    appId: "1:801826800977:web:820347ae1ec17945f5bf70",  
    measurementId: "G-QFHN06VBPZ" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Exporta una función "boot" que se ejecuta durante el arranque de la aplicación en react
export default boot(({ app }) => {
  app.use(VueFire, { app, modules: [] });
});

export { db, storage };