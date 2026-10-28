# Colección Postman · BRINDA

Importar `BRINDA.postman_collection.json` y `BRINDA.local.postman_environment.json`, elegir el environment **BRINDA · local** y ejecutar la colección completa con el Collection Runner (en orden).

- Requiere la API en perfil `local` (seed de desarrollo) en `baseUrl`.
- Antes de correr, completa en el environment `adminPassword` (clave inicial del seed, ver `database/README.md`) y `adminNewPassword` (una clave nueva de al menos 12 caracteres, solo para pruebas); no se versionan.
- `adminPassword` es la clave inicial del seed; en el primer ingreso la colección la cambia a `adminNewPassword`. En corridas posteriores reintenta sola con la nueva.
- Las pausas por rate limit (pedidos 5/min, login 10/min) y el reintento tras un 429 previo son automáticos: una corrida completa tarda ~4–5 min.
- La carpeta 13 bloquea al admin 15 min. Para desbloquearlo: `UPDATE users SET locked_until = NULL, failed_attempts = 0 WHERE username = 'admin';`
- Vencimiento (carpeta 11): para probar un pedido `EXPIRED`, antes de correr: `UPDATE orders SET expires_at = now() - interval '1 minute' WHERE status = 'PENDING' AND order_code = '<código>';` y esperar ~1 min al job. Si no hay vencidos, esas peticiones se omiten.
- Desde consola: `npx newman run BRINDA.postman_collection.json -e BRINDA.local.postman_environment.json`.
- La colección deja datos de prueba (zona, distrito, categoría, producto, combo) y modifica el stock; para volver al seed usa el dump de `backups/`.
- Carpetas del Libro de Reclamaciones: `12b` (registro público: validaciones, honeypot, token, PDF) y `11b` (panel: lista sin datos personales, detalle, respuesta, PDF, sin DELETE) corren antes de la `12`, con el admin logueado. El registro público tiene límite de 3/min por IP; la colección pausa sola.
- Para correr sin tocar el environment, pasa la clave desde el shell sin imprimirla: `PW=$(grep '^POSTMAN_ADMIN_NEW_PASSWORD=' ../backend/.env | cut -d= -f2-)` y `npx newman run BRINDA.postman_collection.json -e BRINDA.local.postman_environment.json --env-var "adminPassword=$PW" --env-var "adminNewPassword=$PW"`. Para una sola parte: `--folder "<nombre de la carpeta>"` (se puede repetir; la `13` bloquea al admin 15 min, evítala salvo en la corrida completa).
- Cada corrida del Libro deja reclamos de prueba en la BD local (no se borran: `brinda_app` no tiene `DELETE`).
