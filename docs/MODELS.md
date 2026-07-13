# Modelos de Datos (Mongoose)

Todos los modelos están definidos en `backend/src/models/`.

---

## User

**Colección:** `users`

Campos:
| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `email` | String | Sí | Sí | — | Email del usuario (lowercase, trim) |
| `passwordHash` | String | Sí | No | — | Hash bcrypt de la contraseña |
| `role` | String | No | No | `"user"` | Rol: `"admin"` o `"user"` |
| `createdAt` | Date | — | — | automático | Timestamp de creación (timestamps: true) |
| `updatedAt` | Date | — | — | automático | Timestamp de actualización |

**Validación:** `role` solo acepta valores `"admin"` o `"user"`.

---

## AccessLog

**Colección:** `accesslogs`

Campos:
| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `ip` | String | No | `""` | Dirección IP del cliente |
| `user` | String | Sí | — | Email del usuario que intentó acceder |
| `date` | Date | No | `new Date()` | Fecha y hora del intento |
| `status` | String | No | `"Concedido"` | `"Concedido"` o `"Denegado"` |

**Notas:**
- `timestamps: false` — no tiene campos automáticos de timestamp.
- Se crea automáticamente al intentar login (tanto exitoso como fallido).

---

## SystemAudit

**Colección:** `systemaudits`

Campos:
| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `time` | String | Sí | — | Hora del evento (formato "HH:MM:SS") |
| `event` | String | Sí | — | Descripción del evento |
| `severity` | String | No | `"Info"` | `"Info"`, `"Alerta"` o `"Crítico"` |
| `createdAt` | Date | — | automático | Timestamp de creación |

**Valores de `severity`:**
- `Info` — Eventos normales (login, creación de usuario, actualización de activo)
- `Alerta` — Eventos importantes (cambio de contraseña, eliminación de activo)
- `Crítico` — Reservado para eventos críticos (actualmente no se usa activamente)

**Eventos registrados:**
- `"Sesión iniciada por {email}"` — al hacer login
- `"Nuevo usuario creado: {email} por {actor}"` — al crear usuario
- `"Activo creado por {actor}: {name}"` — al crear activo
- `"Activo actualizado por {actor}: {name}"` — al actualizar activo
- `"Activo eliminado por {actor}: {name}"` — al eliminar activo
- `"Cambio de credenciales del administrador: {email}"` — al cambiar contraseña admin

---

## Asset

**Colección:** `assets`

Campos:
| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `type` | String | Sí | No | — | Tipo de activo: `"UAV"`, `"Personal"`, `"Vehículo"` |
| `name` | String | Sí | Sí | — | Nombre/identificador del activo |
| `status` | String | Sí | No | — | Estado operativo |
| `icon` | String | Sí | No | `"soldado"` | Icono: `"soldado"`, `"vehiculo"`, `"dron"` |
| `battery` | Number | No | No | `null` | Nivel de batería (0-100), solo UAVs |
| `fuel` | Number | No | No | `null` | Nivel de combustible (0-100), solo Vehículos |
| `personnel` | Number | No | No | `null` | Cantidad de efectivos, solo Personal |
| `latitude` | Number | Sí | No | — | Latitud geográfica |
| `longitude` | Number | Sí | No | — | Longitud geográfica |
| `createdAt` | Date | — | — automático | Timestamp de creación |
| `updatedAt` | Date | — | — automático | Timestamp de actualización |

**Restricciones:**
- `battery`: min 0, max 100
- `fuel`: min 0, max 100
- `personnel`: min 0
- `name` es único (se usa como clave para upsert en `assetService`)

**Lógica de métricas por tipo (en `assetService.js`):**
- `UAV` → usa `battery` (default 100 si no se provee)
- `Vehículo` → usa `fuel` (default 100 si no se provee)
- `Personal` → usa `personnel` (default 1 si no se provee)
