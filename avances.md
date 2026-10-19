# BRINDA — Avances

> Registro de avances y aprendizajes. Se actualiza a medida que se trabaja.

## 2026-10-19

### Hecho
- Revisadas las skills disponibles en `.claude/skills/` (113 `SKILL.md`; el listado mostró 100).
- Leído y comprendido `CONTEXTO-BRINDA.md` completo.

### Aprendido
- Estado del proyecto: diseño cerrado en lo esencial (ERD v2, flujo del pedido); **implementación sin iniciar**.
- Falta `IntelliMarket-develop2.zip` en la carpeta del proyecto; se necesita antes del Hito 1, paso 1.
- Skills relevantes para BRINDA: `frontend-design`, `web-artifacts-builder`, `theme-factory`, `webapp-testing`, plugins `phoenix-*` (PRD, seguridad).
- Reglas del `CLAUDE.md`: respuestas concisas, UI de nivel agencia (mobile-first, a11y), anticipar casos borde, componentes modulares, mapear entidades antes de implementar.

### Decisiones pendientes (técnicas)
- JWT: cookie HttpOnly vs cabecera Bearer.
- Flyway + `ddl-auto=validate` (recomendado).
- Paquete base del backend (p. ej. `com.brinda.api`).

### Siguiente paso (cuando se indique)
Hito 1: extraer ZIP → DDL PostgreSQL → seeds → esqueleto backend → `auth` y `catalog` → colección Postman.
