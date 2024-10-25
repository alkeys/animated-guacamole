import React, { useEffect, useState } from 'react';
import './style/mapaClima.css';

const RadarFrame = () => {
    const [key, setKey] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setKey(prevKey => prevKey + 1);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mapaClima">
            <iframe
                key={key}
                src="https://www.snet.gob.sv/googlemaps/radares/radarS3.php"
                width="100%"
                height="500px"
                frameBorder="0"
            ></iframe>
        </div>
    );
};

export default RadarFrame;
