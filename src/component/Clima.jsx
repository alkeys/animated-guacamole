import React, { useEffect, useState } from 'react';
import { LatitudGPS, LongitudGPS } from "../Service/DataControler.js";
import './style/Clima.css';
export default function WeatherCurrent() {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const apiKey = 'd1800b30682934a87054320db674b4ba'; // Reemplaza con tu clave API de OpenWeatherMap
    const [lat, setLat] = useState(LatitudGPS());
    const [lon, setLon] = useState(LongitudGPS());

    const fetchWeather = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching the weather data:', error);
        }
    };

    const fetchForecast = async () => {
        try {
            setLat(LatitudGPS());
            setLon(LongitudGPS());
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            setForecast(data);
        } catch (error) {
            console.error('Error fetching the forecast data:', error);
        }
    };

    useEffect(() => {
        fetchWeather(); // Llama a fetchWeather al montar el componente
        fetchForecast(); // Llama a fetchForecast al montar el componente

        const intervalId = setInterval(() => {
            fetchWeather();
            fetchForecast();
        }, 2000); // Configura el intervalo para actualizar cada 2 segundos

        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
    }, [lat, lon]);

    if (!weather || !forecast) return <div className="text-center p-4">Cargando...</div>;

    return (
        <div className="hidden sm:block md:block climatotal bg-gray-100 shadow-lg rounded-lg p-6  mx-auto ">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{"Clima api"}</h2>

            <div className={"cardClimaApi"}>
            <div className={"cardClimatodo"
            }>
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{weather.name}</h2>
                <div className="flex justify-center items-center mb-4">
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                        className="w-20 h-20"
                    />
                    <p className="text-5xl font-bold text-gray-800">{Math.round(weather.main.temp)}°C</p>
                </div>
                <p className="text-center text-gray-600 mb-4 capitalize">{weather.weather[0].description}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <span className="material-icons text-blue-500 mr-2">water_drop</span>
                        <span className="text-gray-700">Humedad: {weather.main.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                        <span className="material-icons text-blue-500 mr-2">speed</span>
                        <span className="text-gray-700">Presión: {weather.main.pressure} hPa</span>
                    </div>
                    <div className="flex items-center">
                        <span className="material-icons text-blue-500 mr-2">wind_power</span>
                        <span className="text-gray-700">Viento: {weather.wind.speed} m/s</span>
                    </div>
                    <div className="flex items-center">
                        <span className="material-icons text-blue-500 mr-2">compass_calibration</span>
                        <span className="text-gray-700">Dirección: {weather.wind.deg}°</span>
                    </div>
                </div>
            </div>


            {/* Renderizar el pronóstico */}
            <div className={"cardPronostico"}>
                <h3 className="text-xl font-bold mt-6 text-center text-gray-800">Pronóstico a 5 días</h3>
                <div className="grid pt-10 grid-cols-2 gap-4 mt-4">
                    {forecast.list.slice(0, 5).map((item, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4">
                            <h4 className="text-lg font-semibold">{new Date(item.dt * 1000).toLocaleDateString()}</h4>
                            <img
                                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                alt={item.weather[0].description}
                                className="w-12 h-12"
                            />
                            <p className="text-gray-700">Temp: {Math.round(item.main.temp)}°C</p>
                            <p className="text-gray-700 capitalize">{item.weather[0].description}</p>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    );
}
