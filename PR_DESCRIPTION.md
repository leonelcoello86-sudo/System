# Avance #4 — Entrega parcial

## Resumen
Este PR contiene los cambios necesarios para cumplir los requisitos técnicos del Avance #4: lógica de negocio testeable en el backend, suite de pruebas automatizadas, documentación autogenerada y pipeline de CI que ejecuta lint + tests en cada push/PR.

## Cambios principales
- `backend/src/services/assetService.js`: validación, normalización y función `saveAsset`.
- `backend/src/utils/logger.js`: helpers de logging estructurado.
- `backend/tests/assetService.test.js`: 5 pruebas unitarias sobre la lógica crítica.
- `backend/vitest.config.js`: configuración de tests en Node.
- `backend/jsdoc.json` + `backend/docs/`: documentación técnica generada con JSDoc.
- `backend/.eslintrc.json`: configuración básica de ESLint.
- `backend/package.json`: scripts `test`, `docs`, `lint`, `lint:fix`.
- `.github/workflows/ci.yml`: workflow que ejecuta `npm run lint` y `npm test` en cada push y PR.
- `.github/PULL_REQUEST_TEMPLATE.md`: checklist DoD para PRs.
- `commit-messages.txt`: mensajes Conventional Commits sugeridos.
- `scripts/prepare_and_push.ps1`: script PowerShell interactivo para crear rama, commitear y push (opcional).

## Cómo probar localmente
Abrir terminal y ejecutar estos comandos desde la raíz del repo:

```bash
# Instalar dependencias del backend
cd backend
npm install

# Linter
npm run lint

# Tests
npm test

# Generar docs
npm run docs
# luego abrir backend/docs/index.html
```

## Checklist — Definition of Done (DoD)
- [ ] Pasa `npm run lint` en `backend`
- [ ] Pasa `npm test` en `backend`
- [ ] Documentación generada con `npm run docs`
- [ ] Comentarios principales con JSDoc en funciones/módulos críticos
- [ ] Commits siguen Conventional Commits y referencian tareas
- [ ] Revisado y aprobado por al menos 1 compañero
- [ ] Funciona en entorno limpio usando solo `.env` (ver `backend/.env.example`)

## Notas para el revisor
- El workflow de CI ejecuta lint antes de tests; cualquier fallo bloqueará el merge si se activa la protección de ramas.
- Si se desea, puedo integrar el frontend mínimo (login + CRUD) en otro PR.

