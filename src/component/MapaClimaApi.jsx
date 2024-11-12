import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const WeatherMap = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 }); //

    const API_KEY = 'd1800b30682934a87054320db674b4ba';

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=metric`);
                setWeatherData(response.data);
            } catch (error) {
                console.error("Error fetching the weather data", error);
            }
        };

        fetchWeatherData();
    }, [location, API_KEY]);

    return (
        <MapContainer center={location} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={location}>
                {weatherData && (
                    <Popup>
                        <div>
                            <h2>{weatherData.name}</h2>
                            <p>Temperatura: {weatherData.main.temp} °C</p>
                            <p>Condición: {weatherData.weather[0].description}</p>
                        </div>
                    </Popup>
                )}
            </Marker>
        </MapContainer>
    );
};

export default WeatherMap;
