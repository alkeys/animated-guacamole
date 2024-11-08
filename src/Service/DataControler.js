/**
 * by alkeys
 *
 * @returns {string}
 * @constructor
 */
import datajs from '../Data/data.json' assert { type: 'json' };





function validarDatos(datos) {
// para que los datos esten corecto deben tener 214 elementos
    if (datos.length >= 214 ) {
        return true;
    } else {
        return false;
    }
}

export function ObtenerData() {
    const data = localStorage.getItem('serialData');
    if (data && validarDatos(data)) {
        return data
    } else {
        localStorage.setItem('serialData', JSON.stringify(datajs)); // Convertir de objeto a JSON
        return  localStorage.getItem('serialData');
    }
}

export function EstadoConexion(){
    const data = localStorage.getItem('serialData');
    const datosObjeto = JSON.parse(data);
    if(validarDatos(data) && datosObjeto.DHT.hu!==0){
        return true
    }else {
        return false
    }

}

export function MediaTempDhtBmp(){
    const tempbmp=TemperaturaBMP();
    const tempdht=TemperaturaDHT();
    return (tempbmp+tempdht)/2;
}


export function ObtenerVelicidad(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.V_alkey;
}

export  function HuemdadDHT(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.DHT.hu;
}

export function TemperaturaDHT(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.DHT.tp;
}

export function TemperaturaBMP(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.BMP.tp;
}

export function PresionBMP(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.BMP.pr;
}

export function LatitudGPS(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.GPS.la;
}

export function LongitudGPS(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.GPS.lo;
}

export function AltitudGPS(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.GPS.al;
}

export function DiaGPS(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.GPS.fecha.d;
}

export function MesGPS(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.GPS.fecha.me;
}

export function AnioGPS(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.GPS.fecha.anio;
}

export function HoraGPS(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.GPS.hora.h;
}

export function MinutosGPS(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.GPS.hora.m;
}

export function EstadoTor(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.tor.E_ll;
}

export function ValorTor(){
    const obj = ObtenerData();
    const datosObjeto = JSON.parse(obj);
    return datosObjeto.tor.V_ll;
}
