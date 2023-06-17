# Desafío Bsale - Simulación check-in de aerolínea


## Descripción

Es una API REST con un solo endpoint que permita consultar por el ID del vuelo y retornar la simulación de un check-in automático de los pasajeros de la aerolínea Andes Airlines.

## Desafío

Se debe crear una API REST con un solo endpoint que permita consultar por el ID del vuelo y retornar la simulación del check-in de pasajeros. El lenguaje y/o framework es de libre elección.

Para ello se contará con una base de datos (solo lectura) que contiene todos los datos necesarios para la simulación. El servidor está configurado para que todas aquellas conexiones inactivas por más de 5 segundos sean abortadas, por lo que se requiere controlar la reconexión.

![erd](https://user-images.githubusercontent.com/61089189/228735639-08f7e264-8b2b-4c24-962d-c719dc37626f.png)

Tal como muestra el ERD:

* Una compra puede tener muchas tarjetas de embarque asociadas, pero estas tarjetas pueden no tener un asiento asociado, siempre tendrá un tipo de asiento, por lo tanto, al retornar la simulación del check-in se debe asignar el asiento a cada tarjeta de embarque.

Los puntos a tomar en cuenta son:

* Todo pasajero menor de edad debe quedar al lado de al menos uno de sus acompañantes mayores de edad (se puede agrupar por el id de la compra).

* Si una compra tiene, por ejemplo, 4 tarjetas de embarque, tratar en lo posible que los asientos que se asignen estén juntos, o queden muy cercanos (ya sea en la fila o en la columna).

* Si una tarjeta de embarque pertenece a la clase “económica”, no se puede asignar un asiento de otra clase

* Los campos en la bd están llamados en Snake case, pero en la respuesta de la API deben ser transformados a Camel case.

* El servicio debe tener la siguiente estructura:

```
  GET /flights/:id/passengers
```

Respuesta exitosa:

```
{
    "code": 200,
    "data": {
        "flightId": 1,
        "takeoffDateTime": 1688207580,
        "takeoffAirport": "Aeropuerto Internacional Arturo Merino Benitez, Chile",
        "landingDateTime": 1688221980,
        "landingAirport": "Aeropuerto Internacional Jorge Cháve, Perú",
        "airplaneId": 1,
        "passengers": [
            {
                "passengerId": 98,
                "dni": 172426876,
                "name": "Abril",
                "age": 28,
                "country": "Chile",
                "boardingPassId": 496,
                "purchaseId": 3,
                "seatTypeId": 3,
                "seatId": 15
            },
            {...}
        ]
    }
}
```

Vuelo no encontrado:

```
{
"code": 404,
"data": {}
}
```

En caso de error:

```
{
"code": 400,
"errors": "could not connect to db"
}

```

## Instalación local

Para ejecutar este proyecto, necesitará agregar las siguientes variables de entorno a su archivo .env

`DB_HOST`
`DB_PORT`
`DB_USERNAME`
`DB_PASSWORD`
`DB_DATABASE`

Clonar el proyecto

```bash
$ git clone https://github.com/Franciscof94/BSALE-simulacion-check-in.git
```

Ir al directorio del proyecto

```bash
$ cd bsale-simulacion-check-in
```

Luego instalar las dependencias

```bash
$ npm install
```

Luego ejecutar el comando

```bash
$ npm run start:dev
```

Y navegar a la ruta

```sh
http://localhost:PORT/flights/id/passengers
```

## Tecnologías y lenguajes utilizados

* **TypeScript** (v. 4.7.4) [Source](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
* **Nest Js**(v. 9.0.0)[Source](https://nestjs.com)
* **ts-node**  (v. 10.0.0) [Source](https://www.npmjs.com/package/ts-node)


## Demo
Para el despliegue del proyecto se utilizó Railway.

[![Deploy with Vercel](https://railway.app/)](https://bsale-simulacion-check-in-production.up.railway.app/flights/1/passengers)

