# SECURITY-REPORT · BRINDA (2026-11-02)

Alcance: backend Spring Boot + frontend Angular + scripts de BD + historial Git. Pruebas de ataque solo en localhost; contra producción solo GET inofensivos (`/actuator/health`, `/v3/api-docs`, `/api/v1/admin/products`, `/api/v1/auth/me` → 401; catálogo → 200; Origin ajeno → 403; HTTP → 301 a HTTPS). Sin secretos en este informe.

Resultado de pruebas locales: 92 tests backend verdes (eran 80), 52 frontend verdes, `ng build` ok, migraciones V1–V10 aplican limpias sobre BD vacía (V3 seed excluido, callback de grants ejecutado: `brinda_app` sin DELETE), perfil `prod` arranca, imagen Docker construye.

## Hallazgos

| ID | Sev. | Descripción | Archivo:línea | Estado | Prueba |
|---|---|---|---|---|---|
| S-01 | **Alta** | Rate limit por IP evadible: `forward-headers-strategy=framework` toma la entrada MÁS A LA IZQUIERDA de `X-Forwarded-For` (controlada por el cliente). Anulaba el límite de login/pedidos/reclamos/copias. | `shared/util/ClientIp.java` (antes línea 12), `application-prod.properties:1` | **Corregido** (hops desde la derecha, `TRUSTED_PROXY_HOPS`, fallback al par TCP). **Valor real en Render verificado: 2** (Cloudflare + Render); con 1 se veían IPs de borde | RATE-1..6, `ClientIpTest` |
| S-02 | Media | El enlace de copia del reclamo NO caducaba (el diseño dice 30 días). | `ComplaintService.findByCopyToken` | **Corregido** (404 idéntico a token inexistente; el admin sigue pudiendo bajar el PDF) | CMP-12/13/14, 2 tests |
| S-03 | Media | Sin tope de tamaño de cuerpo: un JSON gigante se leía entero en memoria antes de validar (DoS en instancia pequeña). | `SecurityConfig`, `BodySizeLimitFilter` (nuevo, 64 KB, también chunked) | **Corregido** | SIZE-1/2 |
| S-04 | Media | Spring Boot 3.4.5 con Tomcat/Spring Security/JDBC desactualizados. | `pom.xml:9` | **Corregido parcial**: subido a 3.5.16. **3.5 salió de soporte OSS el 30-06-2026** (3.5.16 fue la última). Requiere decisión: migrar a 4.0.x/4.1.x | 92 tests, Flyway, Docker |
| S-05 | Baja | Content-Type erróneo devolvía 500 + ERROR con stack en el log (ruido para alertas). | `GlobalExceptionHandler` | **Corregido** (415; parámetro faltante 400) | ERR-2 |
| S-06 | Baja | Cada 404/denegado dejaba `AuthorizationDeniedException` con stack en el log (despacho `/error` bajo `denyAll`). | `SecurityConfig` | **Corregido** (`dispatcherTypeMatchers(ERROR)`) | log sin excepción |
| S-07 | Baja | Campos JSON desconocidos y decimales en enteros (`quantity: 1.5` → 1) se aceptaban en silencio. | `application.properties` | **Corregido** (400) | ORD-3/4/5 |
| S-08 | Baja | Cuentas bloqueadas/inactivas respondían sin ejecutar BCrypt: distinguible por tiempo. | `AuthService.login` | **Corregido** | revisión de código |
| S-09 | Baja | Sin eventos de seguridad en stdout (401/403/429/login fallido/bloqueo). Log de integridad podía incluir valores (PII). | `SecurityEventLog` (nuevo), `GlobalExceptionHandler` | **Corregido** (prefijo `SECURITY`, sin tokens ni PII) | log local: sin token/DNI/correo |
| S-10 | Baja | Sin `Permissions-Policy` en la API; CORS aceptaba arrancar con comodín. | `SecurityConfig`, `SecurityProperties` | **Corregido** (la app no arranca con `*`) | HDR-5, `SecurityPropertiesTest` |
| S-11 | Media | Frontend sin cabeceras de seguridad en Cloudflare Pages. | `frontend/public/_headers` (nuevo) | **Corregido, con pendientes** (ver acciones) | `ng build` copia el archivo; CSP revisada contra el HTML generado (hash para el `onload` de fuentes) |
| S-12 | Media | Flyway usa credenciales `brinda_owner` dentro de la misma app: un RCE entrega también el dueño de la BD. | `application.properties:15-16` | **Requiere decisión** (migrar en un paso previo del deploy) | análisis |
| S-13 | Media | La conexión JDBC puede no exigir TLS (`sslmode` por defecto `prefer`). | `DB_URL` en Render | **Pendiente (manual)** | no verificable desde aquí |
| S-14 | Info | Claves de desarrollo `OWNER1234`/`APP1234` y hash bcrypt del admin del seed en el **historial** de Git (commit inicial de scripts/seed). Hoy los scripts piden las claves. | historial | **Pendiente (manual)**: confirmar que no se usaron en Render; si dudas, rotar | `git log -p` |
| S-15 | Info | `.claude/skills/` (repo de terceros, ~5000 archivos) está versionado en este repo. No contiene secretos propios detectados, pero infla la superficie. | `git ls-files .claude` | Pendiente (decisión) | — |
| S-16 | Info | Búsqueda de reclamos admin carga todos en memoria y pagina en Java (escala, no seguridad). | `ComplaintAdminService:78` | Aceptado | — |
| S-17 | Info | Bloqueo de cuenta tras 5 fallos permite a un atacante dejar fuera al admin 15 min (DoS dirigido). Compromiso aceptado; mitigado por el límite por IP ya corregido. | `AuthService` | Riesgo aceptado | LOGIN-8 |
| S-18 | Info | `"3"` (string) se acepta como entero por coerción de Jackson; NUL (0x00) en textos da 409 en vez de 400. | — | Riesgo aceptado | ORD-5, CMP-15 |
| S-19 | Info | Frontend en producción apunta a `api.DOMINIO-PENDIENTE.invalid`; con cookie `SameSite=Strict` la web y la API deben ser del mismo sitio (mismo dominio registrable). `onrender.com` + `pages.dev` NO funcionaría. | `environment.production.ts` | Pendiente (dominio) | — |
| S-20 | Info | Dependencias dev del frontend: 16 moderadas (minimatch/glob vía Angular CLI; arreglo exige `--force`). Dependencias de producción: **0**. `npm audit fix` aplicó el parche de `undici` (alta). | `package-lock.json` | Parcial | `npm audit` |

## Verificado correcto (sin cambios)

JWT: HS512 con clave ≥ 64 bytes, firma verificada, `alg=none`/otra clave/payload alterado/expirado/tokenVersion viejo → 401; solo por cookie `HttpOnly; SameSite=Strict; Path=/api`, 8 h; `Secure` por defecto true (`COOKIE_SECURE`); logout y cambio de clave invalidan sesiones (`token_version`); rol leído de la BD, no del token. BCrypt costo 12; mensajes de login idénticos; clave nueva ≥ 12. Matriz de rutas: todo `/api/v1/admin/**` exige ROLE_ADMIN; `anyRequest().denyAll()`; públicos solo catálogo/delivery GET, pedidos y reclamos POST, copia GET con token, login/logout. CSRF: sin token pero cubierto por SameSite=Strict + CORS que rechaza (403) cualquier `Origin` ajeno incluso en POST simples + solo JSON (prueba CORS-2/3). Precios/total/envío siempre del servidor; cantidades, inactivos, stock, zona/distrito inactivos validados; "Finalizada" 5 veces en paralelo = 1 descuento (bloqueo pesimista). Inyección: sin concatenación en JPQL/Specifications (`escapeLike`), SQLi/XSS en todos los campos probados quedan como texto; PDF de reclamo con payloads hostiles sin error, nombre de archivo = código generado. DNI/CE: AES-256-GCM con IV aleatorio de 12 bytes por valor, nunca en respuestas públicas ni logs (audit en `ORDER_VIEW`). Token de copia: 256 bits, solo se guarda su SHA-256, 20 intentos/min por IP. Errores sin stack (`include-stacktrace=never`). Sin actuator/swagger/h2 (401 también en prod). `ddl-auto=validate`. Seed solo con perfil `local` + `ProdSeedGuard` + test que lo vigila. `.env` nunca estuvo en el historial; `.dockerignore` excluye `.env`, `.git`, `*.md`, `graphify-out`, `backups`. Contenedor corre como usuario no root. Bundle de producción sin claves ni tokens.

## No aplica / no existe

Recuperación de contraseña y otros enlaces temporales (solo la copia del reclamo); subida de archivos (imágenes por `IMAGES_BASE_URL`/R2: validar tipo y tamaño cuando se implemente); envío real de correo (hay `NoopEmailSender`; al conectarlo, revisar inyección de cabeceras: el `@Email` ya rechaza CRLF); refresh tokens; actuator; swagger; `bypassSecurityTrust*`/`innerHTML` en el frontend (0 usos); secretos en `localStorage` (solo carrito y edad).

## Acciones manuales (tuyas)

1. **Render**: `TRUSTED_PROXY_HOPS=2` (verificado: Render con Cloudflare delante; con 1 se veían IPs de borde de Cloudflare). No omitir la variable: el valor por defecto del código es 1. Verificación: pedir `/api/v1/admin/products` (responde 401, sirve) varias veces y comprobar en los logs `SECURITY unauthorized ... ip=` que la IP sea constante y coincida con la IP pública real del cliente; si aparecen IPs de borde de Cloudflare o varían sin motivo, el valor es incorrecto. Cualquier proxy nuevo delante de la API obliga a re-verificar. Si es mayor que el real, el cliente vuelve a controlar su IP; si es menor, clientes comparten límite. Nunca subirlo sin verificar.
2. **Render**: confirmar `COOKIE_SECURE` sin definir o `true`; `CORS_ALLOWED_ORIGINS` con el origen exacto de la web (la app ya no arranca con `*`); `DB_URL` con `?sslmode=require` (o la URL interna de Render y `sslmode=require`).
3. Confirmar que las claves de los roles en Render no son `OWNER1234`/`APP1234`; si lo fueron, rotar (`ALTER ROLE ... PASSWORD`) y actualizar `DB_OWNER_PASSWORD`/`DB_APP_PASSWORD`. Revisar que el admin real no use la clave del seed.
4. **Cloudflare Pages**: el archivo `_headers` se publica solo; al tener dominio de la API, cambiar `connect-src` (hoy `https://brinda-api.onrender.com`) y acotar `img-src`/`media-src` al dominio de R2. Si cambia el HTML generado, recalcular el hash `sha256` del `onload`.
5. Alertas sugeridas en los logs de Render (buscar el texto): `SECURITY login_failed` (≥ 10 en 5 min), `SECURITY account_locked` (cualquiera), `SECURITY rate_limited` (ráfagas), `SECURITY forbidden` (cualquiera), `SECURITY unauthorized ... /api/v1/admin` (picos), `ERROR` (5xx), `Violación de integridad`.
6. Redeploy en Render lo decides tú (nada se desplegó). Tras el redeploy, repetir los GET inofensivos de arriba.

## Decisiones pendientes

- Migrar de Spring Boot 3.5.16 (sin soporte OSS) a 4.x; Maven no tiene dependency-check instalado: para un escaneo de CVE de Maven hace falta añadir `org.owasp:dependency-check-maven` (te pregunto antes).
- Separar migraciones Flyway (owner) del arranque de la app (S-12).
- Qué hacer con `.claude/skills/` versionado (S-15).
- Dependencias sin uso: eliminada `spring-security-test` (test, 0 usos). `cyclonedx-maven-plugin` (SBOM) está declarado pero no enlazado a ninguna fase: déjalo si lo usas a mano.

## Pendientes para la asesora legal (Ley 29733)

Datos personales guardados: nombre, celular, DNI (cifrado), dirección y referencia (pedidos); nombre, documento (cifrado), dirección, teléfono, correo (reclamos); IP en `audit_logs` (hasta 45 car.). En logs: solo ids/códigos, IP en eventos `SECURITY`; nunca DNI, correo, teléfono ni tokens (verificado). Retención: los reclamos "al menos dos años" está marcado por confirmar; no hay política de retención ni de borrado para pedidos ni auditoría, y `brinda_app` no puede borrar (hace falta un procedimiento para atender derechos ARCO). Textos de privacidad/términos y plazos de respuesta: no los redacté; son de la asesora. Confirmar si la IP en auditoría y en logs requiere mención en la política.

## Cambios sin commitear y agrupación sugerida

1. `fix(security): IP del cliente no falsificable` → `ClientIp.java`, `SecurityProperties.java`, `SecurityConfig.java` (PostConstruct), `application.properties` (hops), `.env.example`, `ClientIpTest`, `SecurityPropertiesTest`.
2. `feat(security): caducidad 30 días de la copia del reclamo` → `ComplaintService.java`, `ComplaintServiceTest.java`.
3. `feat(security): tope de cuerpo, eventos SECURITY y manejo de errores` → `BodySizeLimitFilter`, `SecurityEventLog`, `RateLimitFilter`, `AuthService`, `GlobalExceptionHandler` + test, parte de `SecurityConfig` (headers, /error), Jackson estricto en `application.properties`.
4. `chore(deps): Spring Boot 3.5.16; quitar spring-security-test` → `pom.xml`.
5. `chore(frontend): _headers de Cloudflare Pages y npm audit fix` → `frontend/public/_headers`, `frontend/package-lock.json`.
6. `docs: SECURITY-REPORT y avances` → `SECURITY-REPORT.md`, `avances.md`.

Nota: la BD local de desarrollo quedó con datos de prueba (16 pedidos, 6 reclamos «Ana Prueba», un usuario `sectest` desactivado); no los borré (la BD es tuya).
