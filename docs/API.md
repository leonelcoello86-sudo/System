# Referencia de la API REST

Base URL (desarrollo): `http://localhost:5000`

Todas las respuestas exitosas retornan JSON. Los errores retornan `{ message: string, error?: string }`.

---

## Autenticación

### POST `/api/auth/login`

Autentica un usuario y retorna un JWT.

**Body:**
```json
{
  "email": "admin@comando.mil.ve",
  "password": "Alfa123*"
}
```

**Respuesta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "admin@comando.mil.ve",
    "role": "admin"
  }
}
```

**Respuesta 400:** `Email y password requeridos`
**Respuesta 401:** `Credenciales inválidas`

**Efectos secundarios:**
- Crea un registro en `AccessLog` con status "Concedido" o "Denegado"
- Crea un registro en `SystemAudit` con evento "Sesión iniciada por ..."

---

## Usuarios

### POST `/api/users`

Crea un nuevo usuario. **Requiere autenticación + rol admin.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@comando.mil.ve",
  "password": "password123"
}
```

**Respuesta 201:**
```json
{
  "message": "Usuario creado",
  "user": {
    "email": "usuario@comando.mil.ve",
    "role": "user"
  }
}
```

**Respuesta 400:** `email y password requeridos`
**Respuesta 401:** `Missing token` / `Invalid or expired token`
**Respuesta 403:** `Admin only`
**Respuesta 409:** `Ya existe un usuario con ese correo`

---

## Bitácora de Accesos

### GET `/api/access-logs`

Obtiene el historial de intentos de acceso. **Requiere autenticación + rol admin.**

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `today` | string | `"true"` para filtrar solo registros de hoy |
| `page` | number | Número de página (default: 1) |
| `limit` | number | Resultados por página (default: 10) |

**Respuesta 200:**
```json
{
  "logs": [
    {
      "_id": "...",
      "ip": "::1",
      "user": "admin@comando.mil.ve",
      "date": "2025-07-13T10:30:00.000Z",
      "status": "Concedido"
    }
  ]
}
```

---

## Auditoría del Sistema

### GET `/api/system-audit`

Obtiene registros de auditoría del sistema. **Requiere autenticación + rol admin.**

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `today` | string | `"true"` para filtrar solo registros de hoy |

**Respuesta 200:**
```json
{
  "audits": [
    {
      "_id": "...",
      "time": "10:30:00",
      "event": "Sesión iniciada por admin@comando.mil.ve",
      "severity": "Info",
      "createdAt": "2025-07-13T10:30:00.000Z"
    }
  ]
}
```

**Valores de `severity`:** `Info`, `Alerta`, `Crítico`

---

## Activos (Assets)

### GET `/api/assets/summary`

Obtiene el total de activos registrados. **Requiere autenticación.**

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta 200:**
```json
{
  "total": 5
}
```

---

### GET `/api/assets`

Obtiene todos los activos (máximo 500). **Requiere autenticación.**

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta 200:**
```json
{
  "assets": [
    {
      "_id": "...",
      "type": "UAV",
      "name": "Dron-01",
      "status": "Activo",
      "icon": "dron",
      "battery": 85,
      "fuel": null,
      "personnel": null,
      "latitude": 10.4806,
      "longitude": -66.9036,
      "createdAt": "2025-07-13T10:00:00.000Z",
      "updatedAt": "2025-07-13T10:00:00.000Z"
    }
  ]
}
```

---

### POST `/api/assets`

Crea un nuevo activo o actualiza uno existente (upsert por nombre). **Requiere autenticación.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "type": "UAV",
  "name": "Dron-01",
  "status": "Activo",
  "icon": "dron",
  "latitude": "10.4806",
  "longitude": "-66.9036",
  "battery": "85"
}
```

**Campos requeridos:** `type`, `name`, `status`, `icon`, `latitude`, `longitude`

**Valores válidos de `icon`:** `soldado`, `vehiculo`, `dron`

**Valores válidos de `type`:** `UAV`, `Personal`, `Vehículo`

**Métricas por tipo:**
| type | Campo métrico | Rango |
|------|--------------|-------|
| `UAV` | `battery` | 0-100 |
| `Vehículo` | `fuel` | 0-100 |
| `Personal` | `personnel` | >= 0 |

**Respuesta 201 (creado):**
```json
{
  "message": "Asset creado"
}
```

**Respuesta 200 (actualizado):**
```json
{
  "message": "Asset actualizado"
}
```

**Respuesta 400:** `type, name, status, icon, latitude y longitude requeridos`

---

### PUT `/api/assets/:id`

Actualiza un activo por ID. **Requiere autenticación.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** Mismo esquema que POST `/api/assets`.

**Respuesta 200:**
```json
{
  "message": "Asset actualizado",
  "asset": { ... }
}
```

**Respuesta 404:** `Asset no encontrado`

---

### DELETE `/api/assets/:id`

Elimina un activo por ID. **Requiere autenticación.**

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta 200:**
```json
{
  "message": "Asset eliminado"
}
```

**Respuesta 404:** `Asset no encontrado`

**Efecto secundario:** Crea un registro en `SystemAudit` con severity `Alerta`.

---

## Administración

### PUT `/api/admin/admin-password`

Cambia la contraseña del administrador autenticado. **Requiere autenticación + rol admin.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "Alfa123*",
  "newPassword": "NuevaClave123",
  "confirmPassword": "NuevaClave123"
}
```

**Respuesta 200:**
```json
{
  "message": "Credenciales actualizadas"
}
```

**Respuesta 400:** `currentPassword, newPassword y confirmPassword requeridos`
**Respuesta 400:** `newPassword y confirmPassword no coinciden`
**Respuesta 400:** `La nueva contraseña debe tener al menos 8 caracteres`
**Respuesta 401:** `La contraseña actual es incorrecta`

---

## Health Check

### GET `/health`

Endpoint de verificación de salud. No requiere autenticación.

**Respuesta 200:**
```json
{
  "status": "ok",
  "service": "tactical-control-backend",
  "uptime": 123.45
}
```

---

## Middleware de Autenticación

### `authRequired`

Verifica que el header `Authorization` contenga un JWT válido.

```
Authorization: Bearer <token>
```

Si el token es válido, decodifica el payload y lo adjunta a `req.user`:
```js
{
  sub: "user_id",
  email: "user@email.com",
  role: "admin" | "user"
}
```

### `requireAdmin`

Verifica que `req.user.role === 'admin'`. Si no, retorna 403.

---

## Tabla de Permisos por Endpoint

| Endpoint | Método | Auth | Rol |
|----------|--------|------|-----|
| `/health` | GET | No | — |
| `/api/auth/login` | POST | No | — |
| `/api/users` | POST | Sí | admin |
| `/api/access-logs` | GET | Sí | admin |
| `/api/system-audit` | GET | Sí | admin |
| `/api/assets/summary` | GET | Sí | cualquiera |
| `/api/assets` | GET | Sí | cualquiera |
| `/api/assets` | POST | Sí | cualquiera |
| `/api/assets/:id` | PUT | Sí | cualquiera |
| `/api/assets/:id` | DELETE | Sí | cualquiera |
| `/api/admin/admin-password` | PUT | Sí | admin |
