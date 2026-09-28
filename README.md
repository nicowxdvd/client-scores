# client-scores

App React + TypeScript + Vite. Login con email y contraseña y consulta de score por RUT.

## Requisitos

- Node.js 20 o superior
- API backend corriendo en `http://localhost:3000`

## Puesta en marcha

```bash
npm install
cp .env.example .env
npm run dev
```

La app queda en `http://localhost:5173`. Para apuntar a otra API, cambia `VITE_API_URL` en `.env`.

## Comandos

| Comando           | Qué hace                     |
| ----------------- | ---------------------------- |
| `npm run dev`     | Servidor de desarrollo       |
| `npm run build`   | Chequeo de tipos y build     |
| `npm run lint`    | ESLint                       |
| `npm run preview` | Sirve el build de `dist/`    |

## Datos de prueba

Credenciales:

| Email                | Contraseña |
| -------------------- | ---------- |
| `admin@pp-scores.cl` | `@dmin`    |

RUT:

| RUT             | Resultado esperado                                  |
| --------------- | --------------------------------------------------- |
| `11.111.111-1`  | Score numérico y fecha                              |
| `111111111`     | Igual que el anterior (RUT sin formato)             |
| `12.345.678-5`  | Score numérico (dígito verificador válido)          |
| `12.345.678-9`  | Toast "RUT no permitido" (dígito verificador malo)  |
| `abc`           | Aviso de validación en el cliente                   |
| (vacío)         | Aviso de validación, sin request                    |

## Pruebas manuales rápidas

1. Login con credenciales malas: toast "Credenciales inválidas".
2. Login con `admin@pp-scores.cl` / `@dmin`: aparece la vista de score.
3. Consulta `11.111.111-1`: muestra RUT formateado, score y fecha.
4. Borra `client-scores:token` en `sessionStorage` (DevTools > Application) y consulta de nuevo: vuelve al login con "Sesión vencida. Ingresa nuevamente".
5. Apaga el backend e intenta login o consulta: toast "No se pudo conectar con el servidor".
6. Reduce el ancho a 360 px: sin scroll horizontal.

## API

| Endpoint                   | Uso                                      |
| -------------------------- | ---------------------------------------- |
| `POST /login`              | Body `{ email, password }`, devuelve `{ accessToken }` |
| `GET /score?rut=<rut>`     | Header `Authorization: Bearer <token>`   |
