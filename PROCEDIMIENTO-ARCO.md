# Procedimiento ARCO · BRINDA

Cómo atender las solicitudes de los titulares de datos personales (Ley N.º 29733 y su Reglamento, D. S. N.º 016-2024-JUS) sobre los **pedidos** de la tienda. Herramientas: el panel `/admin` y el script `database/setup/arco.sql` (con su lanzador `run-arco.ps1`).

> **Por confirmar con la asesora:** plazos de respuesta, plazos de conservación (tributarios y de reclamos), forma y contenido de la respuesta al titular, criterio para los pedidos confirmados y todo criterio legal. Este documento describe solo la parte técnica; no fija plazos ni criterios.

## 1. Qué datos hay y qué no se toca

| Dónde | Datos personales | Qué hace este procedimiento |
|---|---|---|
| `orders` | nombres, apellidos, celular, documento (cifrado; el tipo en `document_type`), dirección, referencia, consentimiento de promociones | Revocar promociones o anonimizar |
| `order_items` | ninguno (productos y montos) | Nada |
| `audit_logs` | IP (en `ORDER_CREATE` es la del cliente) | **Se conserva** (decisión del usuario, 2026-11-25) |
| `complaints` (Libro de Reclamaciones) | nombre, documento (DNI/CE), domicilio, teléfono, correo | **No se toca**: se conserva al menos 2 años (por confirmar con la asesora) |

Siempre se conservan en el pedido: tipo de documento, montos (estimados y finales), productos, fechas, estado y versiones de términos y privacidad.

## 2. Recepción y registro

1. Las solicitudes llegan al correo indicado en la Política de Privacidad (§9): `brindalicoreria@gmail.com`.
2. Anota cada solicitud en el **registro ARCO** (hoja de cálculo o carpeta de la empresa, **fuera de este repositorio**): fecha de recepción, derecho pedido, cómo se verificó la identidad, códigos de pedido, acción hecha, fecha de respuesta. El repositorio no guarda datos personales.
3. Plazo de respuesta: **por confirmar con la asesora**.

## 3. Verificar la identidad

La Política (§9) pide nombre completo, copia del documento de identidad, el derecho que se ejerce y una descripción.

1. En el panel, **Pedidos**: busca los pedidos del titular (el celular de la solicitud ayuda a ubicarlos con el script en modo `list`, ver §5).
2. Abre cada pedido: el detalle muestra el tipo y número de documento descifrado (la lectura queda en la auditoría). Compáralo con la copia enviada.
3. Usa solo los **códigos** de los pedidos que coinciden. Si hay dudas, no ejecutes nada y pide más información al titular.

## 4. Qué hacer según el derecho

| Derecho | Cómo se atiende |
|---|---|
| Información / acceso | Desde el detalle del pedido en el panel ("Copiar datos de entrega" / "Copiar datos de boleta"). Responde al titular por el canal que defina la asesora. |
| Rectificación | **El panel no edita los datos del cliente.** Pendiente: definir con el usuario la herramienta (hoy no existe). |
| Oposición / revocación del consentimiento (promociones) | Script, acción `revoke-marketing`: deja `marketing_consent = false` y `marketing_consent_at = NULL`. |
| Cancelación / supresión | Script, acción `anonymize`. **Por defecto excluye los pedidos CONFIRMADOS** (base de boletas y obligaciones tributarias); incluirlos exige la opción explícita y el OK de la asesora o del contador. |

## 5. El script

`database/setup/arco.sql` corre con **`brinda_owner`** (único rol que puede escribir en `audit_logs`), en una sola transacción:

- **Siempre simula primero**: muestra código, estado, fecha y si el pedido se excluye; nunca nombre, celular, documento ni dirección. Luego deshace todo.
- Solo guarda con `apply = 1`.
- Rechaza cualquier código que no sea de ese celular (un error de tipeo no alcanza a otra persona).
- Deja un rastro en `audit_logs` (`ARCO_REVOKE_MARKETING` / `ARCO_ANONYMIZE`, con el código y sin datos personales ni IP).
- Anonimizar reemplaza: nombres y apellidos → `ANONIMIZADO`, celular → `000000000`, documento → vacío, dirección → `ANONIMIZADO`, referencia → vacía, y revoca las promociones (cumple los CHECK de `orders`).

### 5.1 Con el lanzador (recomendado, local o producción)

Requisito: Docker Desktop en marcha. Desde la raíz del repo, en PowerShell:

```powershell
.\database\setup\run-arco.ps1           # producción (Render)
.\database\setup\run-arco.ps1 -Local    # BD local de Docker
```

El lanzador pide con `Read-Host` (oculto) la URL de `brinda_owner` **con su clave** y el celular; la acción y los códigos, a la vista. Nada se escribe en la línea de comandos, en archivos ni en pantalla: los valores viajan al contenedor `postgres:16` como variables de entorno y se borran al terminar. Primero muestra la simulación y solo guarda si escribes `APLICAR`.

Pasos:

1. Acción `list` con el celular: ves los códigos, estados y fechas del titular.
2. Verifica esos pedidos en el panel (§3).
3. Repite con `revoke-marketing` o `anonymize` y los códigos verificados. Revisa la simulación.
4. Escribe `APLICAR` solo si coincide con lo que quieres hacer.
5. Anota la acción en el registro ARCO.

### 5.2 Producción en Render: conexión externa

- La URL que pide el lanzador es la **External Database URL** de la base en Render, cambiando el usuario por `brinda_owner` y su clave (la del gestor de claves, `DB_OWNER_PASSWORD`). La URL interna no funciona desde tu PC. El lanzador exige SSL (`PGSSLMODE=require`).
- **Si Render rechaza la conexión externa**, revisa en el panel de Render, base de datos, la sección de control de acceso (*Access Control* / IPs permitidas): agrega **solo tu IP pública actual**, ejecuta el procedimiento y **quítala al terminar**. No abras el acceso a todas las IPs (`0.0.0.0/0`).
- Si tu plan de Render no permite conexiones externas: no ejecutes nada desde otra máquina ni pegues la clave en servicios de terceros. Anota la solicitud y decide con el usuario cómo habilitar el acceso.
- *No verificado contra Render desde este repo*: los nombres de las opciones del panel de Render pueden cambiar; comprueba en su documentación.

### 5.3 Sin el lanzador (psql directo, solo local)

```bash
psql "postgres://brinda_owner@localhost:5433/brinda" -v action=list -v phone=<celular> -f database/setup/arco.sql
psql ... -v action=anonymize -v phone=<celular> -v codes=AA11,BB22 -f database/setup/arco.sql            # simulación
psql ... -v action=anonymize -v phone=<celular> -v codes=AA11,BB22 -v apply=1 -f database/setup/arco.sql # aplica
```

psql pide la clave (no la pongas en la URL). En producción usa el lanzador: así el celular tampoco queda en el historial de comandos.

## 6. Comprobado (2026-11-25)

En una copia desechable de la BD local: `list`, código ajeno rechazado, simulación sin cambios, revocación coherente, anonimización con el confirmado excluido y luego incluido con la opción, tipo de documento y montos conservados, reclamos e IPs de auditoría intactos, auditoría sin datos personales. En la BD local real, solo simulación (sin cambios). Lanzador probado sin `Read-Host` (misma cadena `docker` + `\getenv` + `arco.sql` como `brinda_owner`); la parte interactiva no se probó.
