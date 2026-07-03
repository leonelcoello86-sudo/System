# Backend API (MongoDB Atlas)

## Requisitos
- Node.js
- MongoDB Atlas (cluster)

## Configuración
1) Copia `.env.example` a `.env`
2) Edita:
   - `MONGODB_URI` (MongoDB Atlas)
   - `JWT_SECRET`
   - `ADMIN_EMAIL` y `ADMIN_PASSWORD` (para el admin seed)
   - `CORS_ORIGINS` (si despliegas; en producción debe apuntar a tu dominio del frontend)

## Ejecutar
```bash
npm run dev
```

## Pruebas unitarias
```bash
npm test
```

## Documentación técnica
```bash
npm run docs
```

La documentación generada se publicará en `backend/docs`.

> Si no agregas script dev, ejecuta:
```bash
node server.js
```

