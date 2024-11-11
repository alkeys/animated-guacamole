import React from 'react';
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {useState, useEffect} from "react";
import { obtenerDocumentosall } from '../Service/Firebase/Crudfirebase';
import es from 'date-fns/locale/es';
import { format } from 'date-fns';

registerLocale('es', es);

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherCharts = () => {
    // Configuración de los datos para los gráficos

    const [dateSelected, setDateSelected] = useState(null);

    const [data, setWeatherData] = useState({
        timestamps: [], 
        temperature: [],
        pressure: [],
        humidity: [],
        windSpeed: [],
    });

    useEffect(() => {
        
        const interval = setInterval(() => {
            obtenerDocumentosall(`Data/${dateSelected}/valores`).then((datos) => {
                console.log("fecha", dateSelected ,"datosss", datos)
                setWeatherData(datos);
            }).catch();
            
        }, 10000); //1800000=30 minutos
        return () => clearInterval(interval);

    }, [dateSelected]);

    useEffect(() => {
        console.log(dateSelected)
    }, [dateSelected])

    // Datos para cada gráfico individual
    const createChartData = (label, dataPoints, borderColor, backgroundColor) => ({
        labels: data.timestamps,
        datasets: [
            {
                label,
                data: dataPoints,
                borderColor,
                backgroundColor,
                tension: 0.4,
            },
        ],
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: false,
            },
        },
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <DatePicker value={dateSelected} onChange={(date) => {
                const d = new Date(date);
                const dformated = format(d, 'd-M-yyyy')
                setDateSelected(dformated);}} dateFormat='dd/MM/yyyy' placeholderText='Fecha'></DatePicker>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Gráficos de Parámetros Meteorológicos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gráfico de Temperatura */}
                <div>   
                    <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">Temperatura (°C)</h3>
                    <Line
                        data={createChartData('Temperatura (°C)', data.temperature, 'rgb(255, 99, 132)', 'rgba(255, 99, 132, 0.2)')}
                        options={{ ...options, plugins: { ...options.plugins, title: { display: false } } }}
                    />
                </div>

                {/* Gráfico de Presión */}
                <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">Presión (hPa)</h3>
                    <Line
                        data={createChartData('Presión (hPa)', data.pressure, 'rgb(54, 162, 235)', 'rgba(54, 162, 235, 0.2)')}
                        options={{ ...options, plugins: { ...options.plugins, title: { display: false } } }}
                    />
                </div>

                {/* Gráfico de Humedad */}
                <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">Humedad (%)</h3>
                    <Line
                        data={createChartData('Humedad (%)', data.humidity, 'rgb(75, 192, 192)', 'rgba(75, 192, 192, 0.2)')}
                        options={{ ...options, plugins: { ...options.plugins, title: { display: false } } }}
                    />
                </div>

                {/* Gráfico de Velocidad del Viento */}
                <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">Velocidad del Viento (km/h)</h3>
                    <Line
                        data={createChartData('Velocidad del Viento (km/h)', data.windSpeed, 'rgb(255, 205, 86)', 'rgba(255, 205, 86, 0.2)')}
                        options={{ ...options, plugins: { ...options.plugins, title: { display: false } } }}
                    />
                </div>
            </div>
        </div>
    );
};

const getDate = () => {
    const fechaActual = new Date();
    const day = fechaActual.getDay();
    const month = fechaActual.getMonth() + 1;
    const year = fechaActual.getFullYear();
    
    const date = `${day}/${month}/${year}`
    return date
}

export default WeatherCharts;
