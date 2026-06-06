# TODO - Render/GitHub Ready (funcional completo)

## Hecho (implementado)
- Backend: endpoint para cambiar password del admin (admin-only).
- Backend: CORS configurable con `CORS_ORIGINS`.
- Frontend: conexión real a la API (logs/auditoría/assets/users) usando `VITE_API_URL`.
- Frontend: validación del token al cargar usando endpoint protegido (`/api/assets`).
- Se agregó `src/env.example.js` para documentar `VITE_API_URL`.
- Se agregó `backend/.env.example` y se actualizó `backend/README.md`.

## Pendiente (si aplica)
- Revisar que en tu `render.yaml`/config de Render pongas correctamente:
  - Backend: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGINS`
  - Frontend: `VITE_API_URL` apuntando al backend deploy.

## Verificación local
- Correr backend y frontend.
- Login con el admin seed.
- Probar:
  - AccesoLog: GET /api/access-logs
  - SistemaAudit: GET /api/system-audit
  - ContentManagement: GET/POST /api/assets
  - UserCreation: POST /api/users
  - AdminCredentials: PUT /api/admin/admin-password

