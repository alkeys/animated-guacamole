// Bibliotecas necesarias
#include <Arduino.h>
#include <SFE_BMP180.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include "DHT.h"
#include <TinyGPS.h>
#include <ArduinoJson.h>
/*
codigo para proyecto 
echo por alekys 

*/

// Estructura para almacenar datos
struct DateTime {
  int year;
  byte month;
  byte day;
  byte hour;
  byte minute;
  byte second;
};

struct DatosGPS {
  float latitud;
  float longitud;
  float altitud;
  float velocidad;
  DateTime dateTime;
  bool estado;
};

struct LecturasBMP {
  double temperatura;
  double presion;
  bool estado;
};

struct Humedad {
  float humedad;
  float temperaturaC;
  bool estado;
};

struct lluvia {
  int estado_Lluvia;  // 0 o 1, dependiendo de si hay o no agua
  int valor_lluvia;   // Valor entre 0 y 1023 dependiendo de la cantidad de agua
  bool estado;
};

struct Lecturas {
  float velocidadViento;
  Humedad DHT;
  LecturasBMP BMPDATA;
  DatosGPS datagps;
  lluvia tormentita;
};

//definicion de pines
//gps pines
TinyGPS gps;
SoftwareSerial ss(4, 3);
//pines para el sensor de humeda y temperatura dh
#define DHTPIN  5      // Pin donde está conectado el sensor
#define DHTTYPE DHT22    // Sensor DHT22
DHT dht(DHTPIN, DHT11);  // Inicialización del sensor



//pines para el sensor de precion atmoferica
SFE_BMP180 bmp180;  
//sensor de lluvia
int lluviaA0 = A0;
int lluviaD0 = 6;
//sensor anemimetro
const int pinAnemometro = 2;                 // Pin digital al que está conectado el anemómetro
const int pulsosPorRevolucion = 2;           // Número de pulsos por revolución del anemómetro
const float diametroCopa = 0.05;             // Diámetro de la copa del anemómetro en metros
const unsigned long intervaloReporte = 500;  // Intervalo de tiempo en milisegundos para reporte

// Variables
volatile unsigned long conteoPulsos = 0;  // Contador de pulsos
unsigned long tiempoInicial = 0;          // Tiempo inicial de medición

enum Tipo_Sensor {
  gps_sensor,
  dht_sensor,
  bmp_sensor,
  tormentita_sensor
};

static void smartdelay(unsigned long ms);
DatosGPS obtenerDatosGPS();
Humedad obtenerLecturasDHT();
LecturasBMP obtenerLecturasBMP();
float obtenerVelocidadViento();

void Error(char *sensor) {



}

void Verificacion(Lecturas *datos, void *datosSensor, Tipo_Sensor tipo) {

  if (tipo == dht_sensor) {
    Humedad *dht = (Humedad *)datosSensor;
    if (dht->estado) {
      datos->DHT = *dht;
    } else {
      Error("dht_sensor");
      datos->DHT.estado = dht->estado;
    }
  }

  if (tipo == bmp_sensor) {
    LecturasBMP *bmp = (LecturasBMP *)datosSensor;
    if (bmp->estado) {
      datos->BMPDATA = *bmp;
    } else {
      Error("bmp_sensor");
      datos->BMPDATA.estado = bmp->estado;
    }
  }

  if (tipo == gps_sensor) {
    DatosGPS *datosgps = (DatosGPS *)datosSensor;
    if (datosgps->estado) {
      datos->datagps = *datosgps;
    } else {
      Error("gps_sensor");
      datos->datagps.estado = datosgps->estado;
    }
  }

  if (tipo == tormentita_sensor) {
    lluvia *tormentita = (lluvia *)datosSensor;
    if (tormentita->estado) {
      datos->tormentita = *tormentita;
    } else {
      Error("tormentita_sensor");
      datos->tormentita.estado = tormentita->estado;
    }
  }

}

void Obtenerdata(Lecturas *datos) {
  datos->velocidadViento = obtenerVelocidadViento();
  delay(200);
  LecturasBMP datosbmp = obtenerLecturasBMP();
  Verificacion(&*datos, &datosbmp, bmp_sensor);
  delay(5000);
  DatosGPS datosgps = obtenerDatosGPS();
  Verificacion(&*datos, &datosgps, gps_sensor);
  delay(5000);
  lluvia data_lluvia = obtenerDatoslluvia();
  Verificacion(&*datos, &data_lluvia, tormentita_sensor);
  delay(5000);
  Humedad dht = obtenerLecturasDHT();
  Verificacion(&*datos, &dht, dht_sensor);

}




void setup() {
  Serial.begin(115200);
  ss.begin(9600);
  dht.begin();
  bmp180.begin();
  // Configuración del pin del anemómetro como entrada con resistencia pull-up
  pinMode(pinAnemometro, INPUT_PULLUP);
  pinMode(lluviaD0, INPUT);
}


void loop() {
    Lecturas datos;
    Obtenerdata(&datos);
    StaticJsonDocument<8000> jsonDoc;

    // Velocidad del viento
    jsonDoc["V_alkey"] = datos.velocidadViento;

    // DHT: Humedad y Temperatura
    if (datos.DHT.estado) {
        jsonDoc["DHT"]["hu"] = datos.DHT.humedad;
        jsonDoc["DHT"]["tp"] = datos.DHT.temperaturaC;
    }

    // BMP: Temperatura y Presión
    if (datos.BMPDATA.estado) {
        jsonDoc["BMP"]["tp"] = datos.BMPDATA.temperatura;
        jsonDoc["BMP"]["pr"] = datos.BMPDATA.presion;
    }

    // GPS: Latitud, Longitud, Altitud, Velocidad, Fecha, Hora
    if (datos.datagps.estado) {
        jsonDoc["GPS"]["la"] = datos.datagps.latitud;
        jsonDoc["GPS"]["lo"] = datos.datagps.longitud;
        jsonDoc["GPS"]["al"] = datos.datagps.altitud;

        jsonDoc["GPS"]["fecha"]["d"] = datos.datagps.dateTime.day;
        jsonDoc["GPS"]["fecha"]["me"] = datos.datagps.dateTime.month;
        jsonDoc["GPS"]["fecha"]["anio"] = datos.datagps.dateTime.year;

        jsonDoc["GPS"]["hora"]["h"] = datos.datagps.dateTime.hour;
        jsonDoc["GPS"]["hora"]["m"] = datos.datagps.dateTime.minute;
    }

    // Tormentita: Estado y valor de lluvia
    if (datos.tormentita.estado) {
        jsonDoc["tor"]["E_ll"] = datos.tormentita.estado_Lluvia == 1 ? false : true;
        jsonDoc["tor"]["V_ll"] = datos.tormentita.valor_lluvia;
    }

    // Serializa el objeto JSON y lo envía por el puerto serial
    String jsonString;
    serializeJson(jsonDoc, jsonString); // Serializa el objeto JSON a una cadena
    Serial.println(jsonString); // Envía la cadena JSON por el puerto serial

    delay(1000);  // Pausa antes de enviar otro conjunto de datos
    smartdelay(1000);  // Espera de 1 segundo
}




lluvia obtenerDatoslluvia() {
  int valorDigital = digitalRead(lluviaD0);   // Leer la salida digital
  int valorAnalogico = analogRead(lluviaA0);  // Leer la salida analógica
  lluvia tormentita;
  tormentita.estado_Lluvia = valorDigital;
  tormentita.valor_lluvia = valorAnalogico;
  tormentita.estado = true;
  return tormentita;
}




DatosGPS obtenerDatosGPS() {
  DatosGPS datos = { 0, 0, 0, 0, { 0, 0, 0, 0, 0, 0 } };  // Inicializar los datos a cero
  float flat, flon;
  unsigned long age;

  // Leer el GPS y obtener la posición
  while (ss.available()) {
    gps.encode(ss.read());
  }

  gps.f_get_position(&flat, &flon, &age);
  datos.latitud = flat;
  datos.longitud = flon;
  datos.altitud = gps.f_altitude();
  datos.velocidad = gps.f_speed_kmph();


  // Obtener fecha y hora
  gps.crack_datetime(&datos.dateTime.year, &datos.dateTime.month, &datos.dateTime.day, &datos.dateTime.hour, &datos.dateTime.minute, &datos.dateTime.second);
  datos.estado = flat == flon | datos.dateTime.minute == 66 | datos.dateTime.second == 136 ? false : true;
  return datos;
}

static void smartdelay(unsigned long ms) {
  unsigned long start = millis();
  do {
    while (ss.available())
      gps.encode(ss.read());
  } while (millis() - start < ms);
}


LecturasBMP obtenerLecturasBMP() {
  LecturasBMP datos;
  char status;

  // Inicio de lectura de temperatura
  status = bmp180.startTemperature();
  if (status != 0) {
    delay(status);                                      // Pausa para que finalice la lectura de temperatura
    status = bmp180.getTemperature(datos.temperatura);  // Obtener la temperatura

    if (status != 0) {
      // Inicio de lectura de presión
      status = bmp180.startPressure(3);
      if (status != 0) {
        delay(status);                                                  // Pausa para que finalice la lectura de presión
        status = bmp180.getPressure(datos.presion, datos.temperatura);  // Obtener la presión

        if (status == 0) {
          // Si ocurre un error al obtener la presión, marcamos un error en los datos
          datos.temperatura = -999;
          datos.presion = -999;
        }
      }
    } else {
      datos.temperatura = -999;
      datos.presion = -999;
    }
  } else {
    datos.temperatura = -999;
    datos.presion = -999;
  }

  datos.estado = datos.temperatura == -999 && datos.presion == -999 ? false : true;

  return datos;
}



Humedad obtenerLecturasDHT() {
  Humedad datos;
  // Leemos la humedad y la temperatura
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();  // En grados Celsius

  if (isnan(humedad) || isnan(temperatura)) {
    datos.humedad = -1;       // Valor de error o predeterminado
    datos.temperaturaC = -1;  // Valor de error o predeterminado
  } else {
    // Si las lecturas son válidas
    datos.humedad = humedad;
    datos.temperaturaC = temperatura;
  }
  datos.estado = datos.humedad == -1 && datos.temperaturaC == -1 ? false : true;
  return datos;
}




// Función para contar los pulsos del anemómetro
void contarPulso() {
  conteoPulsos++;
}

// Función para iniciar la medición y devolver la velocidad del viento
float obtenerVelocidadViento() {
  // Iniciar el conteo de tiempo y los pulsos
  conteoPulsos = 0;
  tiempoInicial = millis();

  // Activar interrupción para contar pulsos
  attachInterrupt(digitalPinToInterrupt(pinAnemometro), contarPulso, FALLING);

  // Esperar el intervalo de tiempo definido
  delay(intervaloReporte);

  // Calcular el tiempo transcurrido
  unsigned long tiempoFinal = millis();
  unsigned long diferenciaTiempo = tiempoFinal - tiempoInicial;

  // Desactivar la interrupción
  detachInterrupt(digitalPinToInterrupt(pinAnemometro));

  // Calcular la velocidad del viento
  float tiempoEnSegundos = diferenciaTiempo / 1000.0;
  float revoluciones = conteoPulsos / static_cast<float>(pulsosPorRevolucion);
  float distancia = revoluciones * diametroCopa * PI;
  float velocidadViento = distancia / tiempoEnSegundos;

  return velocidadViento * 3.6;  // Retorna la velocidad del viento en km/h
}
