# Home - Habitacion Poblenou Suite

Aplicacion full stack para gestionar una habitacion de alquiler por dias en Poblenou. Convierte la logica del HTML inicial en datos operativos editables: ficha del alojamiento, calendario, reservas, consultas, servicios, normas, ubicaciones y configuracion de contacto.

## Arquitectura

- `packages/domain`: schemas Zod, estado inicial y reglas puras de negocio.
- `apps/api`: API Express con servicios de aplicacion, repositorios intercambiables, auth JWT en cookie HTTP-only y routers HTTP.
- `apps/web`: React + Vite por features, hooks de auth/estado, cliente API centralizado y fallback local con `localStorage`.
- `cypress`: pruebas E2E sobre la app real.

## Dominio

Entidades principales: `listings`, `availabilityDays`, `bookings`, `inquiries`, `services`, `houseRules`, `locations` y `siteSettings`.

Reglas puras principales: noches checkout-exclusive, conflictos de reservas activas, estado derivado de disponibilidad, cotizacion de reserva y metricas del panel.

Los datos importados desde `habitacion_vfinal (1).html` viven en `createInitialState()` y todos quedan editables desde la UI. Los seeds solo se usan al crear/resetear estado; los cambios del usuario se persisten por usuario.

## Comandos

```bash
npm install
npm run dev
npm run dev:api
npm run dev:web
npm run lint
npm run test
npm run test:coverage
npm run build
npm run e2e
npm run e2e:open
npm run check
npm start
```

En desarrollo, `npm run dev` compila el dominio y levanta API en `http://localhost:4000` y web en `http://localhost:5173`.

## Variables de entorno

```bash
PORT=4000
CORS_ORIGIN=http://localhost:5173
DATA_FILE=./apps/api/data/state.json
USERS_FILE=./apps/api/data/users.json
DATABASE_URL=postgresql://...
AUTH_USERNAME=admin
AUTH_PASSWORD=admin
AUTH_PASSWORD_HASH=
AUTH_JWT_SECRET=dev-secret-change-me
AUTH_COOKIE_NAME=app_session
AUTH_SESSION_TTL_SECONDS=604800
```

`VITE_API_URL` es opcional en el frontend. Si no se define, Vite usa el proxy `/api` hacia la API local.

## Persistencia

- Tests: `MemoryStateRepository` y `MemoryUserRepository`.
- Desarrollo: JSON local en `DATA_FILE` y `USERS_FILE`, aislado por usuario.
- Produccion: PostgreSQL si existe `DATABASE_URL`, guardando estado JSONB por `owner_id`.

## Auth

La sesion usa JWT firmado con `AUTH_JWT_SECRET` y cookie HTTP-only con `sameSite: lax`. En desarrollo existe usuario fallback `AUTH_USERNAME`/`AUTH_PASSWORD`; en produccion no se acepta password plano si no hay hash o usuarios registrados.

## Deploy en Render

`render.yaml` define un unico servicio Node:

- Build: `npm ci --include=dev && npm run build`.
- Start: `npm start`.
- `NODE_ENV=production`.
- `DATABASE_URL`, `AUTH_USERNAME`, `AUTH_PASSWORD` y `AUTH_JWT_SECRET` como variables/secretos.

En produccion, la API sirve `apps/web/dist` con `express.static` y fallback a `index.html`.

## Workflows cubiertos

- Login/registro y logout.
- Panel con KPIs derivados del dominio.
- Calendario editable con estado, tarifa y nota por dia.
- CRUD de reservas y consultas.
- CRUD de servicios incluidos/extras, normas y ubicaciones importadas.
- CRUD de ficha del alojamiento y configuracion de sitio.
- Reset de estado inicial por usuario.