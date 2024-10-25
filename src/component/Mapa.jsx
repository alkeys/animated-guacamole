import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Mapa = ({ lat, lng }) => {
    // Validación para evitar errores si lat/lng no están disponibles
    if (!lat || !lng) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-xl text-gray-700 animate-pulse">
                    Esperando coordenadas...
                </p>
            </div>
        );
    }

    return (
        <div className="h-96 w-full rounded-lg shadow-lg">
            <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        Latitud: {lat}, Longitud: {lng}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Mapa;
