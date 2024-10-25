// RadarFrame.jsx
import React from 'react';
import './style/mapaClima.css';
const RadarFrame = () => {
    return (
        <div className="mapaClima">
            <iframe src="https://www.snet.gob.sv/googlemaps/radares/radarS3.php" width="100%" height="500px;"
                    frameBorder="0"></iframe>
        </div>
    );
};

export default RadarFrame;
