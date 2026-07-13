# Arquitectura del Sistema

## Nombre del Proyecto
**Tactical Control Dashboard** — Sistema de Control Táctico

## Descripción General
Aplicación web fullstack para gestión y monitoreo táctico de activos (UAVs, vehículos, personal). Permite autenticación con JWT, gestión de activos en mapa geoespacial, bitácora de accesos y auditoría del sistema.

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 18.3.1 |
| Build Tool | Vite | 5.4.1 |
| CSS Framework | Tailwind CSS | 3.4.4 |
| Mapa | Leaflet + react-leaflet | 1.9.4 / 4.2.1 |
| Iconos | lucide-react | 0.499.0 |
| Backend | Node.js + Express | 4.19.2 |
| Base de datos | MongoDB (Mongoose) | 8.6.3 |
| Autenticación | JWT (jsonwebtoken) | 9.0.2 |
| Hash de contraseñas | bcrypt | 6.0.0 |
| Testing Backend | Vitest | 4.1.9 |
| Documentación | JSDoc | 4.0.5 |

## Arquitectura de Directorios

```
System/
├── src/                          # Frontend React
│   ├── App.jsx                   # Componente raíz (auth flow)
│   ├── main.jsx                  # Punto de entrada React
│   ├── index.css                 # Estilos globales + Tailwind
│   ├── env.example.js            # Ejemplo de variables de entorno
│   └── components/               # Componentes UI
│       ├── Login.jsx             # Formulario de login
│       ├── TacticalDashboard.jsx # Layout principal del dashboard
│       ├── Sidebar.jsx           # Barra lateral de navegación
│       ├── Header.jsx            # Cabecera con reloj y perfil
│       ├── ProfileMenu.jsx       # Menú desplegable de perfil (admin)
│       ├── HomeModule.jsx        # Panel de resumen diario
│       ├── MapView.jsx           # Mapa geoespacial con Leaflet
│       ├── MapPlaceholder.jsx    # Placeholder del mapa
│       ├── TelemetryPanel.jsx    # Panel de telemetría de activos
│       ├── ContentManagement.jsx # CRUD de activos
│       ├── AccessLog.jsx         # Bitácora de accesos
│       ├── SystemAudit.jsx       # Auditoría del sistema
│       ├── UserCreation.jsx      # Formulario de creación de usuarios
│       ├── AdminCredentials.jsx  # Cambio de contraseña admin
│       └── LogsPanel.jsx         # Panel de logs de eventos (mock)
├── backend/                      # Backend Express
│   ├── server.js                 # Punto de entrada del servidor
│   ├── package.json              # Dependencias del backend
│   ├── .env                      # Variables de entorno (no subir a git)
│   ├── .env.example              # Ejemplo de variables de entorno
│   ├── vitest.config.js          # Configuración de testing
│   ├── jsdoc.json                # Configuración de JSDoc
│   ├── src/
│   │   ├── config/
│   │   │   └── jwt.js            # Utilidades JWT (placeholder)
│   │   ├── middleware/
│   │   │   └── authRequired.js   # Middleware de auth y roles
│   │   ├── models/
│   │   │   ├── User.js           # Modelo de usuario
│   │   │   ├── AccessLog.js      # Modelo de bitácora de accesos
│   │   │   ├── SystemAudit.js    # Modelo de auditoría del sistema
│   │   │   └── Asset.js          # Modelo de activos
│   │   ├── routes/
│   │   │   ├── auth.routes.js    # Rutas de autenticación
│   │   │   ├── users.routes.js   # Rutas de gestión de usuarios
│   │   │   ├── access-logs.routes.js  # Rutas de bitácora
│   │   │   ├── system-audit.routes.js # Rutas de auditoría
│   │   │   ├── assets.routes.js  # Rutas CRUD de activos
│   │   │   └── admin.routes.js   # Rutas administrativas
│   │   ├── seed/
│   │   │   └── adminSeed.js      # Seed del usuario admin
│   │   ├── services/
│   │   │   └── assetService.js   # Lógica de negocio de activos
│   │   └── utils/
│   │       └── logger.js         # Logger con timestamps
│   └── tests/
│       ├── health.test.js        # Test del endpoint /health
│       └── assetService.test.js  # Tests unitarios del servicio de assets
├── docs/                         # Documentación del proyecto
├── .github/                      # Configuración de CI/CD
├── package.json                  # Dependencias del frontend
├── vite.config.js                # Configuración de Vite (proxy /api)
├── tailwind.config.js            # Configuración de Tailwind
├── postcss.config.js             # Configuración de PostCSS
├── Dockerfile                    # Contenedor Docker (producción)
├── render.yaml                   # Configuración de Render
└── index.html                    # HTML entry point de Vite
```

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                    Puerto 5173                           │
│                                                         │
│  App.jsx                                                │
│  ├── Login.jsx ────────── POST /api/auth/login          │
│  │                                                      │
│  └── TacticalDashboard.jsx                              │
│      ├── Sidebar.jsx       (navegación)                  │
│      ├── Header.jsx        (reloj + perfil)              │
│      │   └── ProfileMenu.jsx (admin actions)            │
│      ├── HomeModule.jsx ─ GET /api/assets               │
│      │                  ─ GET /api/access-logs?today=true│
│      │                  ─ GET /api/system-audit?today=true│
│      ├── MapView.jsx ───── GET /api/assets              │
│      │   └── TelemetryPanel.jsx                         │
│      ├── ContentManagement.jsx  CRUD /api/assets        │
│      ├── AccessLog.jsx ──── GET /api/access-logs        │
│      ├── SystemAudit.jsx ── GET /api/system-audit       │
│      ├── UserCreation.jsx ─ POST /api/users             │
│      └── AdminCredentials.jsx PUT /api/admin/admin-password│
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP (fetch + JWT Bearer)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Express)                       │
│                  Puerto 5000                             │
│                                                         │
│  server.js                                              │
│  ├── Middleware: CORS, JSON Parser                       │
│  ├── GET /health                                        │
│  ├── /api/auth      → authRouter                        │
│  ├── /api/users     → usersRouter (admin)               │
│  ├── /api/access-logs → accessLogsRouter (admin)        │
│  ├── /api/system-audit → systemAuditRouter (admin)      │
│  ├── /api/assets    → assetsRouter (auth)               │
│  └── /api           → adminRouter (admin)               │
│                                                         │
│  Middleware:                                             │
│  ├── authRequired  → verifica JWT Bearer token          │
│  └── requireAdmin  → verifica role === 'admin'          │
└─────────────────────┬───────────────────────────────────┘
                      │ Mongoose ODM
                      ▼
┌─────────────────────────────────────────────────────────┐
│              BASE DE DATOS (MongoDB Atlas)               │
│                                                         │
│  Colecciones:                                           │
│  ├── users          (email, passwordHash, role)         │
│  ├── accesslogs     (ip, user, date, status)            │
│  ├── systemaudits   (time, event, severity)             │
│  └── assets         (type, name, status, icon, coords,  │
│                      battery/fuel/personnel)             │
└─────────────────────────────────────────────────────────┘
```

## Flujo de Autenticación

```
1. Usuario ingresa email + password en Login.jsx
2. Frontend POST /api/auth/login con { email, password }
3. Backend busca usuario en MongoDB por email
4. Backend compara password con bcrypt.compare()
5. Si es válido:
   a. Crea AccessLog con status "Concedido"
   b. Crea SystemAudit con evento "Sesión iniciada"
   c. Genera JWT con { sub, email, role } y expiración 1h
   d. Retorna { token, user: { email, role } }
6. Frontend guarda token y user en localStorage
7. Todas las peticiones posteriores incluyen header Authorization: Bearer <token>
8. En App.jsx, al recargar la página, se valida el token contra /api/assets
```

## Flujo de Seed Admin

```
1. Al iniciar server.js, se ejecuta startServer()
2. startServer() conecta a MongoDB
3. Llama a ensureAdminUser()
4. Si ADMIN_EMAIL y ADMIN_PASSWORD existen en .env:
   a. Busca si ya existe un usuario con ese email
   b. Si no existe, lo crea con role 'admin' y password hasheado
   c. Si ya existe, no hace nada
```

## Patrones de Diseño

### Backend
- **Service Layer**: `assetService.js` encapsula la lógica de validación, transformación y persistencia de activos
- **Middleware Chain**: `authRequired` → `requireAdmin` para proteger endpoints
- **Seed Pattern**: `adminSeed.js` asegura la existencia del usuario admin al arrancar
- **Centralized Logging**: `logger.js` proporciona logging con timestamps uniformes

### Frontend
- **Component Composition**: Dashboard compone módulos independientes vía switch/case
- **Event-driven Updates**: CustomEvents (`system-audit-updated`, `access-log-updated`) sincronizan módulos
- **Token-based Session**: JWT almacenado en localStorage, validado al cargar la app
- **Proxy Pattern**: Vite proxea `/api` al backend en desarrollo

## Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT con expiración configurable (default 1h)
- CORS configurado por origen (solo localhost:5173 en desarrollo)
- Endpoints admin protegidos con doble middleware (auth + role)
- Variables sensibles en `.env` excluidas de git
- El `JWT_SECRET` actual es `"change-me-please"` — debe cambiarse en producción
