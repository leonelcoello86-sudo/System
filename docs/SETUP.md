# Guía de Instalación y Configuración

## Requisitos Previos

- **Node.js** v18+ (recomendado: LTS)
- **npm** v9+
- **MongoDB Atlas** (o una instancia MongoDB accesible)

## 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd System
```

## 2. Instalar Dependencias

### Frontend (desde la raíz)
```bash
npm install
```

### Backend
```bash
cd backend
npm install
cd ..
```

O desde la raíz con el script abreviado:
```bash
npm run backend:install
```

## 3. Configurar Variables de Entorno

### Backend

Copia el archivo de ejemplo y edítalo:
```bash
cd backend
copy .env.example .env
```

Edita `backend/.env` con tus valores:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del backend | `5000` |
| `MONGODB_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://...` |
| `JWT_SECRET` | Secreto para firmar JWT | `tu-secreto-seguro` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `1h` |
| `ADMIN_EMAIL` | Email del admin seed | `admin@comando.mil.ve` |
| `ADMIN_PASSWORD` | Password del admin seed | `admin123456` |
| `CORS_ORIGINS` | Orígenes permitidos (separados por coma) | `http://localhost:5173` |

### Frontend (opcional)

El archivo `.env` en la raíz ya existe con:
```
VITE_API_URL=http://localhost:5000
```

Si necesitas cambiar la URL del backend, edita este archivo.

## 4. Levantar el Servidor

Necesitas **dos terminales** abiertas simultáneamente:

### Terminal 1 — Backend
```bash
cd backend
npm run dev
```

El servidor arrancará en `http://localhost:5000`. Verás en consola:
```
MongoDB connected
Admin user seeded: admin@comando.mil.ve
Backend listening on http://localhost:5000
```

### Terminal 2 — Frontend
```bash
npm run dev
```

Vite arrancará en `http://localhost:5173`. Las llamadas a `/api` se proxean automáticamente al backend.

## 5. Verificar el Funcionamiento

1. Abre `http://localhost:5173` en tu navegador
2. Inicia sesión con las credenciales del admin seed:
   - **Email:** `admin@comando.mil.ve`
   - **Password:** `Alfa123*` (o el que hayas configurado en `.env`)
3. Verifica que el dashboard carga correctamente

## 6. Pruebas

```bash
cd backend
npm test
```

Esto ejecuta los tests unitarios con Vitest:
- `health.test.js` — Verifica el endpoint `/health`
- `assetService.test.js` — Verifica parseNumber, validateAssetPayload, buildAssetData

## 7. Documentación Técnica (JSDoc)

```bash
cd backend
npm run docs
```

Genera documentación HTML en `backend/docs/index.html`.

---

## Troubleshooting

### "Missing env var MONGODB_URI"
El archivo `backend/.env` no tiene la variable `MONGODB_URI`. Asegúrate de que exista y tenga una URI válida.

### "CORS policy: access denied"
El origen del frontend no está en `CORS_ORIGINS`. Agrega `http://localhost:5173` al archivo `backend/.env`.

### Error de conexión a MongoDB
Verifica que la URI de MongoDB Atlas sea correcta y que tu IP esté en la whitelist de Atlas.

### Frontend no conecta al backend
Verifica que `VITE_API_URL` en `.env` de la raíz apunte a `http://localhost:5000` y que el backend esté corriendo.
