import React, { useState, useEffect } from 'react';
import { HuemdadDHT, MediaTempDhtBmp, ObtenerVelicidad, PresionBMP,LatitudGPS,LongitudGPS } from "../Service/DataControler.js";
import './style/datos.css';
import Mapa from "./Mapa.jsx";
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

    const fetchWeatherData = () => {
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
        fetchWeatherData();
        const interval = setInterval(fetchWeatherData, 2000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p className="text-center">Cargando datos...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="hoverxd bg-gradient-to-r from-blue-100 to-blue-300 p-6 rounded-lg shadow-lg max-w-sm mx-auto transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Estación Meteorológica</h2>
            <div className="space-y-6">
                {/* Temperatura */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <span className="material-icons mr-2">thermostat</span>
                        <p className="text-lg font-semibold text-gray-700">Temperatura:</p>
                    </div>
                    <p className="text-lg text-gray-800">{weatherData.temperature}°C</p>
                </div>

                {/* Presión Atmosférica */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <span className="material-icons mr-2">air</span>
                        <p className="text-lg font-semibold text-gray-700">Presión Atmosférica:</p>
                    </div>
                    <p className="text-lg text-gray-800">{weatherData.pressure} hPa</p>
                </div>

                {/* Humedad */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <span className="material-icons mr-2">water_drop</span>
                        <p className="text-lg font-semibold text-gray-700">Humedad:</p>
                    </div>
                    <p className="text-lg text-gray-800">{weatherData.humidity}%</p>
                </div>

                {/* Velocidad del Viento */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <span className="material-icons mr-2">wind_power</span>
                        <p className="text-lg font-semibold text-gray-700">Velocidad del Viento:</p>
                    </div>
                    <p className="text-lg text-gray-800">{weatherData.windSpeed} km/h</p>
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
