# RUNBOOK — Tactical Control Dashboard

Guía de primeros auxilios del sistema. Ejecutar estos pasos en orden cuando se detecte una anomalía.

---

## Fase #1 — Diagnóstico

Verificar la salud del sistema bajo un incidente.

### 1.1 Verificar endpoint de salud

```bash
curl -s https://tactical-control-dashboard-backend.onrender.com/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "tactical-control-backend",
  "db": "connected",
  "uptime": 12345.67
}
```

- `status: "ok"` → todo funciona.
- `status: "degraded"` → MongoDB desconectado.
- Sin respuesta → el servicio está caído.

### 1.2 Verificar logs en Render

1. Ir a [dashboard.render.com](https://dashboard.render.com)
2. Seleccionar el servicio `tactical-control-dashboard-backend`
3. Ir a la pestaña **Logs**
4. Buscar mensajes `[ERROR]` o `correlationId` para identificar la falla

### 1.3 Verificar estado de MongoDB Atlas

1. Ir a [cloud.mongodb.com](https://cloud.mongodb.com)
2. Seleccionar el clúster
3. Ir a **Monitoring** → verificar CPU, conexiones y latency

### 1.4 Verificar pipeline de GitHub Actions

```bash
# O desde CLI con gh
gh run list --repo leonelcoello86-sudo/System --limit 5
```

O ir a [github.com/leonelcoello86-sudo/System/actions](https://github.com/leonelcoello86-sudo/System/actions)

---

## Fase #2 — Protocolo ante Caídas

Niveles de escalado para contener una falla antes de afectar el SLA.

### Nivel L1 — Restart del servicio (0-5 min)

**Cuando:** El health check falla o el servicio no responde.

1. Ir a Render Dashboard → `tactical-control-dashboard-backend`
2. Hacer clic en **Manual Deploy** → **Clear build cache & deploy**
3. Esperar a que el servicio vuelva a mostrar estado **Live**
4. Verificar con `curl /health`

### Nivel L2 — Redeploy completo (5-15 min)

**Cuando:** L1 no resuelve o hay error de build.

1. Verificar que el último commit en `main` esté limpio
2. En Render Dashboard → **Manual Deploy** → **Deploy latest commit**
3. Si el build falla, revisar los logs de build en Render
4. Verificar variables de entorno en **Environment** → que todas estén configuradas:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `CORS_ORIGINS`
   - `NODE_ENV=production`

### Nivel L3 — Rollback (15-30 min)

**Cuando:** L2 no resuelve o un deploy introduce un bug crítico.

1. Ir a GitHub → [github.com/leonelcoello86-sudo/System/commits/main](https://github.com/leonelcoello86-sudo/System/commits/main)
2. Identificar el último commit funcional (antes del bug)
3. Crear un revert:

```bash
git revert <commit-hash>
git push origin main
```

4. El CD pipeline ejecutará el deploy automáticamente con la versión anterior
5. Verificar con `curl /health`

---

## Fase #3 — Recuperación ante Desastres

Restaurar el sistema desde cero en caso de corrupción total de datos.

### Regla 3-2-1 de respaldos

- **3** copias de los datos
- **2** medios diferentes (MongoDB Atlas + dump local)
- **1** copia fuera del entorno (archivo local descargado)

### 3.1 Restaurar MongoDB Atlas (desde backup automático)

1. Ir a MongoDB Atlas → **Clusters** → **Backup**
2. Seleccionar el punto en el tiempo deseado
3. Hacer clic en **Restore**
4. Esperar a que la restauración complete
5. Verificar la conexión con el backend

### 3.2 Restaurar desde dump manual (si existe)

```bash
# Descargar el dump más reciente del backup local
mongorestore --uri="MONGODB_URI_NUEVA" --archive=dump-YYYY-MM-DD.gz --gzip
```

### 3.3 Re-deploy del backend

1. Verificar que las variables de entorno estén correctas en Render
2. Forzar redeploy desde Render Dashboard → **Manual Deploy** → **Clear build cache & deploy**
3. Verificar salud:

```bash
curl -s https://tactical-control-dashboard-backend.onrender.com/health
```

### 3.4 Verificar integridad

1. Hacer login con el admin seed
2. Verificar que los assets existentes carguen en el mapa
3. Revisar que la bitácora de accesos y auditoría estén accesibles
4. Probar CRUD de un asset de prueba

### 3.5 Post-mortem

1. Documentar la causa raíz del fallo
2. Crear un issue en GitHub con la etiqueta `incident`
3. Actualizar este RUNBOOK si se descubrió un nuevo punto de falla

---

## Información de contacto del sistema

| Recurso | URL |
|---------|-----|
| Repositorio | https://github.com/leonelcoello86-sudo/System |
| Backend (producción) | https://tactical-control-dashboard-backend.onrender.com |
| Frontend (producción) | https://tactical-control-dashboard-frontend.onrender.com |
| Health check | https://tactical-control-dashboard-backend.onrender.com/health |
| MongoDB Atlas | https://cloud.mongodb.com |
| Render Dashboard | https://dashboard.render.com |
| GitHub Actions | https://github.com/leonelcoello86-sudo/System/actions |
