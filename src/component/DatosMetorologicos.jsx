import React, { useState, useEffect } from 'react';
import { HuemdadDHT, MediaTempDhtBmp, ObtenerVelicidad, PresionBMP,LatitudGPS,LongitudGPS } from "../Service/DataControler.js";
import './style/datos.css';
import Mapa from "./Mapa.jsx";
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../Service/Firebase/FirebaseService.js';
const WeatherStation = () => {
    const [weatherData, setWeatherData] = useState({
        temperature: null,
        pressure: null,
        humidity: null,
        windSpeed: null,
        latitude: null,
        longitude: null
    });


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const weatherRef = doc(db, 'Data', 'lastUpdate'); // Referencia al documento
    

    const fetchWeatherDataOnline = () => {
        
        const unsubscribe = onSnapshot(weatherRef, (docSnapshot) => {
            console.log("Datos Online");
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              console.log(data)
              setWeatherData(data);
              setLoading(false);
            } else {
              console.log("No existe el coumento")
              setError(true);
            }
        
         });
       
        return unsubscribe;
        
   
        
    }

    const fetchWeatherDataLocal = () => {
        console.log("Datos offline")
        const data = {
            temperature: MediaTempDhtBmp().toFixed(2),
            pressure: PresionBMP().toFixed(2),
            humidity: HuemdadDHT(),
            windSpeed: ObtenerVelicidad(),
            latitude: LatitudGPS(),
            longitude: LongitudGPS()
        };
        setWeatherData(data);
        setLoading(false);
      
    };


    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); // Detectar si es un dispositivo móvil

        let interval;
        let unsubscribe;
    
        if (isMobile) {
          console.log("Usando datos en línea");
          unsubscribe = fetchWeatherDataOnline(); // Se suscribe a Firestore
          interval = setInterval(fetchWeatherDataOnline, 2000); // Intervalo para obtener datos en línea cada 2 segundos
        } else {
          console.log("Usando datos locales");
          fetchWeatherDataLocal(); // Usamos datos locales directamente
          interval = setInterval(fetchWeatherDataLocal, 2000); // Intervalo para obtener datos locales cada 2 segundos
        }
    
        // Limpiar intervalos y suscripción cuando el componente se desmonte
        return () => {
          if (unsubscribe) {
            unsubscribe(); // Limpiar la suscripción de Firestore
          }
          clearInterval(interval); // Limpiar el intervalo
        };
    }, []);

    if (loading) return <p className="text-center">Cargando datos...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="hoverxd bg-gradient-to-r from-blue-100 to-blue-300 p-6 rounded-lg shadow-lg max-w-sm mx-auto transition-transform transform hover:scale-105">
            <h2 className="text-sm md:text-2xl lg:text-2xl font-bold text-gray-800 mb-4 text-center">Estación Meteorológica</h2>
            <div className="space-y-6">
                {/* Temperatura */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <span className="material-icons mr-2">thermostat</span>
                        <p className="text-sm md:text-xl lg:text-xl  font-semibold text-gray-700">Temperatura:</p>
                    </div>
                    <p className="text-sm md:text-lg lg:text-lg text-gray-800">{weatherData.temperature}°C</p>
                </div>

                {/* Presión Atmosférica */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <span className="material-icons mr-2">air</span>
                        <p className="text-sm md:text-lg lg:text-lg font-semibold text-gray-700">Presión:</p>
                    </div>
                    <p className="text-sm md:text-lg lg:text-lg text-gray-800"> {weatherData.pressure} hPa</p>
                </div>

                {/* Humedad */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <span className="material-icons mr-2">water_drop</span>
                        <p className="text-sm md:text-lg lg:text-lg font-semibold text-gray-700">Humedad:</p>
                    </div>
                    <p className="text-sm md:text-lg lg:text-lg text-gray-800">{weatherData.humidity}%</p>
                </div>

                {/* Velocidad del Viento */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <span className="material-icons mr-2">wind_power</span>
                        <p className="text-sm md:text-lg lg:text-lg font-semibold text-gray-700">Velocidad del Viento:</p>
                    </div>
                    <p className="text-sm md:text-lg lg:text-lg text-gray-800">{weatherData.windSpeed} km/h</p>
                </div>
            </div>
{/*           para el mapa */}
            <div className="mt-6">
                <Mapa lat={weatherData.latitude} lng={weatherData.longitude} />
            </div>
        </div>
    );
};



export default WeatherStation;
