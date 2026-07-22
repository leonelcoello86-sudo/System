# Tactical Control Dashboard

Dashboard web (React + Vite + Tailwind) con backend Node.js + Express + MongoDB.

---

## Modelado de Base de Datos

### Diagrama Entidad-Relación

```mermaid
erDiagram
    USER {
        string email PK "Email único, lowercased"
        string passwordHash "Hash bcrypt"
        string role "admin | user"
        date createdAt "Timestamp automático"
        date updatedAt "Timestamp automático"
    }

    ACCESSLOG {
        string ip "IP del cliente"
        string user "Email del usuario"
        date date "Fecha/hora del intento"
        string status "Concedido | Denegado"
    }

    SYSTEMAUDIT {
        string time "Hora del evento (HH:MM:SS)"
        string event "Descripción del evento"
        string severity "Info | Alerta | Crítico"
        date createdAt "Timestamp automático"
    }

    ASSET {
        string type "UAV | Vehículo | Personal"
        string name "Nombre único del activo"
        string status "Estado operativo"
        string icon "soldado | vehiculo | dron"
        number battery "0-100 (UAV)"
        number fuel "0-100 (Vehículo)"
        number personnel ">= 0 (Personal)"
        number latitude "Coordenada lat"
        number longitude "Coordenada lon"
        date createdAt "Timestamp automático"
        date updatedAt "Timestamp automático"
    }

    USER ||--o{ ACCESSLOG : "genera"
    USER ||--o{ SYSTEMAUDIT : "genera"
    ASSET ||--o{ SYSTEMAUDIT : "produce eventos"
```

### Diccionario de Datos

#### Colección `users`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `_id` | ObjectId | PK, automático | Identificador único del documento |
| `email` | String | `required`, `unique`, `lowercase`, `trim` | Email institucional del usuario |
| `passwordHash` | String | `required` | Contraseña hasheada con bcrypt (10 rounds) |
| `role` | String | `enum: ['admin', 'user']`, default `'user'` | Rol del usuario en el sistema |
| `createdAt` | Date | Automático (`timestamps: true`) | Fecha de creación del registro |
| `updatedAt` | Date | Automático (`timestamps: true`) | Fecha de última actualización |

#### Colección `accesslogs`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `_id` | ObjectId | PK, automático | Identificador único del documento |
| `ip` | String | Default `''` | Dirección IP del cliente que intentó acceder |
| `user` | String | `required` | Email del usuario que intentó acceder |
| `date` | Date | Default `new Date()` | Fecha y hora del intento de acceso |
| `status` | String | `enum: ['Concedido', 'Denegado']` | Resultado del intento de login |

#### Colección `systemaudits`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `_id` | ObjectId | PK, automático | Identificador único del documento |
| `time` | String | `required` | Hora del evento en formato `HH:MM:SS` |
| `event` | String | `required` | Descripción textual del evento registrado |
| `severity` | String | `enum: ['Info', 'Alerta', 'Crítico']`, default `'Info'` | Nivel de severidad del evento |
| `createdAt` | Date | Automático (`timestamps: true`) | Fecha de creación del registro |

#### Colección `assets`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `_id` | ObjectId | PK, automático | Identificador único del documento |
| `type` | String | `required` | Tipo de activo: `UAV`, `Vehículo` o `Personal` |
| `name` | String | `required`, `unique` | Nombre único del activo táctico |
| `status` | String | `required` | Estado operativo del activo |
| `icon` | String | `enum: ['soldado', 'vehiculo', 'dron']`, default `'soldado'` | Icono para representación en mapa |
| `battery` | Number | `min: 0`, `max: 100`, default `null` | Nivel de batería (solo UAV) |
| `fuel` | Number | `min: 0`, `max: 100`, default `null` | Nivel de combustible (solo Vehículos) |
| `personnel` | Number | `min: 0`, default `null` | Cantidad de personal (solo Personal) |
| `latitude` | Number | `required` | Coordenada de latitud |
| `longitude` | Number | `required` | Coordenada de longitud |
| `createdAt` | Date | Automático (`timestamps: true`) | Fecha de creación del registro |
| `updatedAt` | Date | Automático (`timestamps: true`) | Fecha de última actualización |

---

## Diagramas UML

### Diagrama de Caso de Uso

```mermaid
graph TB
    subgraph "Actores"
        Visitante["Visitante"]
        Usuario["Usuario Autenticado"]
        Admin["Administrador"]
        Sistema["Sistema (Automático)"]
    end

    subgraph "Casos de Uso"
        Login["Iniciar Sesión"]
        VerMapa["Ver Mapa Táctico"]
        GestionarActivos["Gestionar Activos\n(CRUD)"]
        VerBitacora["Ver Bitácora de Accesos"]
        VerAuditoria["Ver Auditoría del Sistema"]
        CrearUsuario["Crear Nuevo Usuario"]
        CambiarPassword["Cambiar Credenciales\nAdmin"]
        HealthCheck["Health Check\n(/health)"]
        SeedAdmin["Seed Admin\n(Al arrancar)"]
        LogsAutomaticos["Generar Logs\nAutomáticamente"]
    end

    Visitante --> Login
    Usuario --> VerMapa
    Usuario --> GestionarActivos
    Usuario --> VerBitacora
    Admin --> VerMapa
    Admin --> GestionarActivos
    Admin --> VerBitacora
    Admin --> VerAuditoria
    Admin --> CrearUsuario
    Admin --> CambiarPassword
    Sistema --> HealthCheck
    Sistema --> SeedAdmin
    Sistema --> LogsAutomaticos
```

### Diagrama de Arquitectura

```mermaid
graph LR
    subgraph "Frontend (React + Vite)"
        A["Browser\n(localhost:5173)"]
        B["React App"]
        C["15 Componentes\nUI"]
    end

    subgraph "API Gateway (Express)"
        D["Helmet\n(Security Headers)"]
        E["CORS\n(Cross-Origin)"]
        F["Rate Limiter\n(100 req/15min)"]
        G["Correlation ID\n(UUID v4)"]
        H["Body Parser\n(1mb max)"]
        I["Mongo Sanitize\n(NoSQL Injection)"]
    end

    subgraph "Business Logic"
        J["Auth Routes\n(JWT + bcrypt)"]
        K["Assets Routes\n(CRUD + Validación)"]
        L["Users Routes\n(Creación admin)"]
        M["Access Logs\n(Registro)"]
        N["System Audit\n(Auditoría)"]
        O["Admin Routes\n(Password change)"]
    end

    subgraph "Data Layer"
        P["MongoDB Atlas\n(Cluster)"]
        Q["4 Colecciones\nusers, accesslogs,\nsystemaudits, assets"]
    end

    subgraph "Cross-Cutting"
        R["Error Handler\n(correlationId)"]
        S["Logger JSON\n(logJson)"]
        T["Password Policy\n(8+ chars, special)"]
    end

    A --> B --> C
    C --> D --> E --> F --> G --> H --> I
    I --> J & K & L & M & N & O
    J & K & L & M & N & O --> P --> Q
    J & K & L & M & N & O --> R & S
    J & L --> T
```

### Diagrama de Secuencia — Flujo General del Sistema

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as MongoDB Atlas

    Note over U,DB: === FASE 1: Autenticación ===
    U->>F: Ingresa email + password
    F->>B: POST /api/auth/login
    B->>B: Valida email (regex)
    B->>B: Rate Limiter check
    B->>DB: User.findOne({email})
    DB-->>B: User document
    B->>B: bcrypt.compare(password, hash)
    alt Credenciales válidas
        B->>DB: AccessLog.create({status:'Concedido'})
        B->>DB: SystemAudit.create({event:'Sesión iniciada'})
        B-->>F: {token, user}
        F->>F: localStorage.setItem('token')
        F-->>U: Dashboard Táctico
    else Credenciales inválidas
        B->>DB: AccessLog.create({status:'Denegado'})
        B-->>F: 401 "Credenciales inválidas"
        F-->>U: Mensaje de error
    end

    Note over U,DB: === FASE 2: Operaciones Autenticadas ===
    U->>F: Navega a módulo (Mapa/Gestión/Logs)
    F->>B: GET /api/assets (con Bearer token)
    B->>B: authRequired middleware (verifica JWT)
    B->>DB: Asset.find({})
    DB-->>B: [assets]
    B-->>F: {assets}
    F-->>U: Renderiza datos en UI

    Note over U,DB: === FASE 3: Gestión de Activos ===
    U->>F: Crea/actualiza activo
    F->>B: POST /api/assets (con payload)
    B->>B: validateAssetPayload()
    B->>B: sanitizeString() en campos
    B->>DB: Asset.create() o updateOne()
    B->>DB: SystemAudit.create({event:'Activo creado'})
    B-->>F: {message: 'Asset creado'}
    F-->>U: UI actualizada
```

### Diagrama de Flujo — Proceso Crítico 1: Autenticación

```mermaid
flowchart TD
    Start([Inicio: Login]) --> Input[/Ingresa email + password/]
    Input --> ValidateEmail{¿Email válido?<br>(regex + longitud)}
    ValidateEmail -->|No| Error400[Error 400:<br>Formato de email inválido]
    ValidateEmail -->|Sí| CheckRequired{¿Campos requeridos<br>completos?}
    CheckRequired -->|No| Error400B[Error 400:<br>Email y password requeridos]
    CheckRequired -->|Sí| RateLimit{¿Rate limit<br>excedido?<br>(5 intentos/15min)}
    RateLimit -->|Sí| Error429[Error 429:<br>Demasiados intentos]
    RateLimit -->|No| FindUser[(Buscar user en DB)]
    FindUser --> UserExists{¿User existe?}
    UserExists -->|No| LogDenegado1[AccessLog: Denegado]
    LogDenegado1 --> Error401[Error 401:<br>Credenciales inválidas]
    UserExists -->|Sí| ComparePass[bcrypt.compare]
    ComparePass --> PassOk{¿Password correcto?}
    PassOk -->|No| LogDenegado2[AccessLog: Denegado]
    LogDenegado2 --> Error401
    PassOk -->|Sí| LogConcedido[AccessLog: Concedido]
    LogConcedido --> AuditLog[SystemAudit:<br>Sesión iniciada]
    AuditLog --> GenToken[Generar JWT<br>(exp: 1h)]
    GenToken --> ReturnToken[/Retorna: token + user/]
    ReturnToken --> StoreToken[localStorage: token + user]
    StoreToken --> Dashboard([Dashboard Táctico])

    style Start fill:#059669,color:#fff
    style Dashboard fill:#059669,color:#fff
    style Error400 fill:#dc2626,color:#fff
    style Error400B fill:#dc2626,color:#fff
    style Error429 fill:#dc2626,color:#fff
    style Error401 fill:#dc2626,color:#fff
```

### Diagrama de Flujo — Proceso Crítico 2: Gestión de Activos

```mermaid
flowchart TD
    Start([Inicio: CRUD Activo]) --> Auth{¿Autenticado?<br>(Bearer token)}
    Auth -->|No| Error401[Error 401:<br>Missing token]
    Auth -->|Sí| ValidateToken{¿Token válido?<br>(JWT verify)}
    ValidateToken -->|No| Error401B[Error 401:<br>Invalid token]
    ValidateToken -->|Sí| Method{¿Método HTTP?}

    Method -->|POST| ValidateBody[validateAssetPayload]
    Method -->|PUT| ValidateId{¿ObjectId válido?}
    Method -->|DELETE| ValidateIdD{¿ObjectId válido?}
    Method -->|GET| FetchAll[(Asset.find: limit 500)]
    FetchAll --> ReturnAll[/Retorna: assets/]

    ValidateId -->|No| Error400ID[Error 400:<br>ID inválido]
    ValidateId -->|Sí| ValidateBody
    ValidateIdD -->|No| Error400ID
    ValidateIdD -->|Sí| CheckExists{¿Asset existe?}

    ValidateBody --> PayloadOk{¿Payload válido?<br>(type, name, icon,<br>coords)}
    PayloadOk -->|No| Error400[Error 400:<br>message de validación]
    PayloadOk -->|Sí| Sanitize[sanitizeString<br>en name, type, status]
    Sanitize --> BuildData[buildAssetData<br>(normaliza battery/fuel/personnel)]

    BuildData --> UPSERT{¿Asset con<br>mismo nombre?}
    UPSERT -->|Sí| Update[(Asset.updateOne)]
    UPSERT -->|No| Create[(Asset.create)]

    Update --> AuditUpdate[SystemAudit:<br>Activo actualizado]
    Create --> AuditCreate[SystemAudit:<br>Activo creado]
    AuditUpdate --> ReturnOk[/Retorna: 200 OK/]
    AuditCreate --> ReturnCreated[/Retorna: 201 Created/]

    CheckExists -->|No| Error404[Error 404:<br>Asset no encontrado]
    CheckExists -->|Sí| Delete[(Asset.findByIdAndDelete)]
    Delete --> AuditDelete[SystemAudit:<br>Activo eliminado - Severity: Alerta]
    AuditDelete --> ReturnDel[/Retorna: Asset eliminado/]

    style Start fill:#059669,color:#fff
    style ReturnAll fill:#059669,color:#fff
    style ReturnOk fill:#059669,color:#fff
    style ReturnCreated fill:#059669,color:#fff
    style ReturnDel fill:#059669,color:#fff
    style Error401 fill:#dc2626,color:#fff
    style Error401B fill:#dc2626,color:#fff
    style Error400ID fill:#dc2626,color:#fff
    style Error400 fill:#dc2626,color:#fff
    style Error404 fill:#dc2626,color:#fff
```

---

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

## Pruebas y documentación técnica
- `cd backend && npm test` — ejecuta la suite de pruebas unitarias del backend
- `cd backend && npm run docs` — genera la documentación técnica en `backend/docs`
- `npm run backend:test` — ejecuta los tests del backend desde la raíz
- `npm run backend:docs` — genera la documentación del backend desde la raíz

## Build de producción
```bash
npm run build
```

## Scripts útiles
- `npm run backend:install` — instala dependencias del backend
- `npm run backend:dev` — inicia el backend desde la raíz

## Comandos para evaluación (tests y documentación)

Sigue estos comandos para reproducir lo que se evaluará en el avance:

- Instalar dependencias del backend:

```bash
cd backend
npm install
```

- Ejecutar la suite de pruebas del backend:

```bash
cd backend
npm test
```

- Generar la documentación técnica autocontenida (JSDoc):

```bash
cd backend
npm run docs
# Abrir `backend/docs/index.html` en un navegador para ver la documentación
```

- Levantar el backend en desarrollo:

```bash
cd backend
npm run dev
```

El workflow de CI está en `.github/workflows/ci.yml` y ejecuta los tests del backend en cada `pull_request` y `push` a `main`.
- `npm run backend:test` — ejecuta pruebas del backend
- `npm run backend:docs` — genera documentación técnica del backend

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

