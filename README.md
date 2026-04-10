# Calculadora científica (React + Node.js)

Proyecto fullstack de una calculadora científica con:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Motor matemático:** mathjs

## Características

- Operaciones básicas: `+`, `-`, `*`, `/`, `%`
- Funciones científicas: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log`, `ln`, `sqrt`, `^`, `!`
- Constantes: `π`, `e`
- Cambio de modo angular: `RAD` / `DEG`
- Uso de `ans` (último resultado)
- Historial de operaciones

## Estructura

```txt
.
├─ client/   # React app
└─ server/   # API Node.js
```

## Instalación

```bash
npm run install:all
```

## Ejecutar en desarrollo

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Endpoints backend

### `GET /api/health`
Estado del servidor.

### `POST /api/calculate`
Calcula expresiones matemáticas.

Body JSON de ejemplo:

```json
{
  "expression": "sin(45)^2 + cos(45)^2",
  "angleMode": "DEG",
  "ans": 0
}
```

Respuesta:

```json
{
  "expression": "sin(45)^2 + cos(45)^2",
  "normalized": "sin(45)^2 + cos(45)^2",
  "result": 1
}
```
