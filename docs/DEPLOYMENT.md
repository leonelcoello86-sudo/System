# Guía de Despliegue

## Opción 1: Docker

### Construir la imagen
```bash
docker build -t tactical-control-dashboard .
```

### Ejecutar
```bash
docker run -p 5000:5000 \
  -e MONGODB_URI="mongodb+srv://..." \
  -e JWT_SECRET="tu-secreto" \
  -e ADMIN_EMAIL="admin@comando.mil.ve" \
  -e ADMIN_PASSWORD="admin123456" \
  -e CORS_ORIGINS="https://tu-frontend.onrender.com" \
  tactical-control-dashboard
```

**Nota:** El Dockerfile solo incluye el backend. El frontend se despliega como estático por separado.

### Dockerfile explicado
```dockerfile
FROM node:20-alpine          # Runtime ligero
WORKDIR /app
COPY package.json ...       # Dependencias raíz
COPY backend/package.json ... # Dependencias backend
RUN npm install --omit=dev  # Solo dependencias de producción
COPY . .                    # Código fuente
RUN cd backend && npm run docs  # Genera documentación
EXPOSE 5000
CMD ["node", "backend/server.js"]  # Solo backend
```

---

## Opción 2: Render

El archivo `render.yaml` define dos servicios:

### Backend (Web Service)
- **Nombre:** `tactical-control-dashboard-backend`
- **Plan:** Free
- **Build:** `cd backend && npm install`
- **Start:** `cd backend && npm run start`
- **Health Check:** `/health`
- **Variables de entorno requeridas:**
  - `NODE_ENV=production`
  - `PORT=10000`
  - `MONGODB_URI` (configurar en Render Dashboard)
  - `JWT_SECRET` (configurar en Render Dashboard)
  - `ADMIN_EMAIL` (configurar en Render Dashboard)
  - `ADMIN_PASSWORD` (configurar en Render Dashboard)
  - `CORS_ORIGINS=https://tactical-control-dashboard-frontend.onrender.com`

### Frontend (Static Site)
- **Nombre:** `tactical-control-dashboard-frontend`
- **Plan:** Free
- **Build:** `npm install && npm run build`
- **Publish:** `dist/`
- **Variables de entorno:**
  - `VITE_API_URL=https://tactical-control-dashboard-backend.onrender.com`

### Pasos para desplegar en Render

1. Sube el código a GitHub
2. En Render Dashboard, crea un "New Web Service" para el backend
3. Conecta el repositorio y configura:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm run start`
4. Agrega las variables de entorno en el Dashboard de Render
5. Crea un "New Static Site" para el frontend
6. Configura:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
7. Agrega `VITE_API_URL` apuntando al backend desplegado

---

## Opción 3: Servidor Manual

### Backend
```bash
cd backend
npm install --omit=dev
export NODE_ENV=production
export PORT=5000
export MONGODB_URI="mongodb+srv://..."
export JWT_SECRET="tu-secreto-seguro"
export ADMIN_EMAIL="admin@comando.mil.ve"
export ADMIN_PASSWORD="admin123456"
node server.js
```

### Frontend (build estático)
```bash
npm install
npm run build
# Servir la carpeta dist/ con nginx, Apache, o cualquier servidor estático
```

### Ejemplo de configuración nginx
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/system/dist;
    index index.html;

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Variables de Entorno de Producción

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno | `production` |
| `PORT` | Puerto del backend | `5000` o `10000` |
| `MONGODB_URI` | URI completa de MongoDB Atlas | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secreto fuerte para JWT (mínimo 32 chars) | `随机字符串` |
| `JWT_EXPIRES_IN` | Expiración del token | `1h`, `8h`, `7d` |
| `ADMIN_EMAIL` | Email del admin inicial | `admin@comando.mil.ve` |
| `ADMIN_PASSWORD` | Password del admin inicial | `contraseña-segura` |
| `CORS_ORIGINS` | Orígenes permitidos (separados por coma) | `https://frontend.onrender.com` |
| `VITE_API_URL` | URL del backend para el frontend | `https://backend.onrender.com` |

---

## Checklist de Producción

- [ ] Cambiar `JWT_SECRET` por un valor seguro y único
- [ ] Cambiar `ADMIN_PASSWORD` por una contraseña segura
- [ ] Configurar `CORS_ORIGINS` con el dominio real del frontend
- [ ] Verificar que MongoDB Atlas tiene IP whitelist configurada
- [ ] Verificar que `VITE_API_URL` apunta al backend correcto
- [ ] Verificar que el build del frontend funciona (`npm run build`)
- [ ] Probar el endpoint `/health` para verificar que el backend responde
- [ ] Verificar que los logs de MongoDB no contengan credenciales
