# BRINDA

Licorería con delivery en Lima. Catálogo público, carrito local y pedido que se cierra por WhatsApp con pago Yape/Plin. Panel de administración para la dueña (pendiente).

- **Backend:** Spring Boot 3.4.5 / Java 21 (`backend/`), PostgreSQL 16 en Docker (`brinda-db/`), migraciones en `backend/src/main/resources/db/migration`.
- **Frontend:** Angular 21 (`frontend/`): landing, catálogo, carrito y checkout (formulario).
- **Estado y decisiones:** `avances.md`, `CONTEXTO-BRINDA.md` (secciones 18 y 19), `PRODUCT.md`, `DESIGN.md`.
- **Retomar con Claude Code:** pegar el prompt de `PROMPT-INICIO-SESION.md`.

## Levantar todo en local (VS Code, Windows)

Abre la carpeta `BRINDA` en VS Code y usa tres terminales (`Ctrl+Ñ`, botón `+`, PowerShell). **Respeta el orden.**

### 0. Docker Desktop
Ábrelo y espera a que diga "Engine running" (ícono verde). Sin esto, `docker` falla con "cannot find the file specified".

### 1. Base de datos (terminal 1)
```powershell
cd brinda-db
docker compose up -d
```
Si el contenedor ya existe, también sirve `docker start brinda-db`. Queda en `127.0.0.1:5433` (base `brinda`). Los datos viven en un volumen y se conservan al apagarla.

Comprobar: `docker ps` debe listar `brinda-db` como `Up`.

### 2. Backend (terminal 2)
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```
Espera la línea `Started BrindaApplication` (unos 10 s). Escucha en el puerto 8080. Lee su configuración de `backend/.env` (ignorado por git; no lo compartas ni lo imprimas). El perfil `local` carga el seed de desarrollo (5 productos, categorías, 20 distritos).

Comprobar: abre http://localhost:8080/api/v1/catalog/categories (debe devolver JSON).

> Usa JDK 21. Con Java 25, Lombok no compila. Ajusta la ruta de `JAVA_HOME` si tu versión del JDK es distinta.

### 3. Frontend (terminal 3)
```powershell
cd frontend
npm install        # solo la primera vez o si falta node_modules
npx ng serve --host 0.0.0.0
```
Abre http://localhost:4200. El proxy `frontend/proxy.conf.json` reenvía `/api` al backend (8080), así que no hay problemas de CORS.

La primera carga después de instalar dependencias nuevas puede recargarse sola una vez (comportamiento de Vite).

### Probar desde el celular
Mismo Wi‑Fi que la PC. Averigua la IP con `ipconfig` (IPv4) y abre `http://<esa-IP>:4200`. Si no abre, permite el puerto 4200 en el Firewall de Windows.

## Apagar
1. `Ctrl+C` en la terminal del frontend y en la del backend.
2. `docker stop brinda-db` (o `cd brinda-db; docker compose stop`). No borra datos. **No uses `docker compose down -v`**: eso borra el volumen.
3. Cierra Docker Desktop si necesitas la memoria. Con poca RAM, apaga primero el backend y el frontend.

## Pruebas
```powershell
cd frontend
npx ng test --no-watch     # 33 tests (Vitest), no necesita servidores
npx ng build               # build de producción (debe salir sin avisos)

cd ../backend
mvn test                   # 45 tests unitarios (con JAVA_HOME en JDK 21)
```
Verificaciones en navegador (Playwright, en `frontend/`, con los servidores arriba; guardan capturas en `frontend/capturas/`, ignorada por git):
```powershell
node scripts/catalogo-api.mjs   # catálogo contra la API real (necesita backend)
node scripts/pedido.mjs         # checkout contra la API real (necesita backend)
node scripts/catalogo.mjs       # catálogo con datos de ejemplo (solo ng serve)
node scripts/carrito.mjs        # carrito con datos de ejemplo (solo ng serve)
```
En PowerShell, ejecútalas con `node`; Git Bash convierte `/` en rutas.

## Problemas comunes
| Síntoma | Causa y solución |
|---|---|
| El catálogo dice "No pudimos cargar el catálogo" | El backend o la base están apagados. Levanta primero la base y luego el backend. |
| El catálogo muestra 27 productos que no son de la base | Quedó activa la bandera de ejemplo. En la consola del navegador: `localStorage.removeItem('brinda.mock')` y recarga. |
| El carrito dice "Ya no está disponible" en productos viejos | Eran de la base de ejemplo; usa "Quitar" o "Vaciar carrito". |
| `docker` no conecta | Docker Desktop no está abierto del todo. |
| El puerto 5433 está ocupado | Hay otro Postgres. El contenedor viejo `intellimarket-postgres-1` (apagado) usa el mismo puerto: no lo inicies. |
| El backend no arranca por Flyway o credenciales | Revisa que `brinda-db` esté `Up` y que existan `backend/.env` y `brinda-db/.env` (no se suben a git). |
| `mvn` no encuentra Java 21 | Define `$env:JAVA_HOME` como arriba en esa terminal. |

## Reglas del repo
- Sin commits ni push sin pedirlo. Nunca subir `.env`, `DNI_ENCRYPTION_KEY`, JWT ni contraseñas.
- No ejecutar nada destructivo sobre la base sin confirmación.
- Detalle de reglas de trabajo y diseño: `CLAUDE.md`.
