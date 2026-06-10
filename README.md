# Tactical Control Dashboard

Dashboard web (React + Vite + Tailwind) con backend Node.js + Express + MongoDB.

## Estructura del repositorio
- `src/`: frontend React
- `backend/`: backend Express con MongoDB Atlas

## Requisitos
- Node.js (recomendado LTS)
- MongoDB Atlas o una base de datos MongoDB accesible

## Configuración
1. En la raíz del proyecto:
   ```bash
   npm install
   ```
2. En el backend:
   ```bash
   cd backend
   npm install
   ```
3. Copia el archivo de ejemplo en el backend:
   ```bash
   cd backend
   copy .env.example .env
   ```
4. Configura en `backend/.env`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `CORS_ORIGINS`

5. Si necesitas cambiar el backend de desarrollo para el frontend, crea un archivo `.env` en la raíz con:
   ```bash
   VITE_API_URL=http://localhost:5000
   ```

## Ejecutar en desarrollo
1. Levanta el backend:
   ```bash
   cd backend
   npm run dev
   ```
2. Levanta el frontend desde la raíz:
   ```bash
   npm run dev
   ```

## Build de producción
```bash
npm run build
```

## Scripts útiles
- `npm run backend:install` — instala dependencias del backend
- `npm run backend:dev` — inicia el backend desde la raíz

## Qué ya está implementado
- Inicio de sesión real con JWT (`POST /api/auth/login`)
- Middleware de autenticación y autorización (`authRequired`, `requireAdmin`)
- Gestión de usuarios (`POST /api/users`)
- Bitácora de accesos (`GET /api/access-logs`)
- Auditoría de eventos (`GET /api/system-audit`)
- Gestión de activos (`GET /api/assets`, `POST /api/assets`)
- Cambio de contraseña administrativo (`PUT /api/admin/admin-password`)

## Nota de seguridad
No subas `.env` ni credenciales reales al repositorio. El archivo `.env` está excluido en `.gitignore`.

