# TODO - Estado actual

El proyecto ya cuenta con la integración completa de frontend y backend.

- [x] Crear carpeta `backend/` con `package.json`.
- [x] Instalar dependencias en `backend`.
- [x] Crear backend base con express, cors y conexión a MongoDB.
- [x] Crear modelos Mongoose: `User`, `AccessLog`, `SystemAudit`, `Asset`.
- [x] Crear auth con JWT: endpoint `POST /api/auth/login`.
- [x] Crear endpoints protegidos para usuarios, logs, auditoría y assets.
- [x] Configurar middleware `authRequired` y `requireAdmin`.
- [x] Actualizar frontend para llamar al backend con JWT.
- [x] Añadir ejemplos de `.env` para backend.
- [x] Verificar build de frontend.

## Pruebas pendientes localmente
- Arrancar backend con `cd backend && npm run dev`
- Arrancar frontend con `npm run dev`
- Hacer login con el admin seed
- Crear usuario, actualizar activos, consultar logs y auditoría

