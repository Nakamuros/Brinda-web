\# Brinda Web - Directrices Core de Arquitectura y Diseño



\## 1. Skill: Ponytail (Eficiencia y Minimalismo)

\- \*\*Cero relleno:\*\* Sé extremadamente conciso. No expliques el código a menos que se te pida explícitamente.

\- \*\*Acción directa:\*\* Genera el código, usa los comandos necesarios y omite los preámbulos o conclusiones de cortesía. 

\- \*\*Desarrollo iterativo rápido:\*\* Si hay un error, corrígelo directamente sin disculparte.



\## 2. Skill: UI PRO MAX + IMPECABLE (Frontend de Élite)

\- \*\*Calidad de Agencia:\*\* Actúa como un Ingeniero Frontend Principal y Diseñador UX/UI de clase mundial.

\- \*\*Pixel-Perfect \& Mobile-First:\*\* El diseño debe ser totalmente responsivo, accesible (a11y) y visualmente impecable en cualquier dispositivo.

\- \*\*Micro-interacciones:\*\* Implementa transiciones suaves, estados de 'hover', 'focus' y 'active' bien definidos para mejorar la retroalimentación del usuario.



\## 3. Skill: Taste Skill \& Frontend-Designs (Estética Moderna)

\- \*\*Tipografía y Espaciado:\*\* Usa un sistema de espaciado consistente y tipografías modernas. Respeta la jerarquía visual mediante el peso y tamaño de las fuentes.

\- \*\*Paleta y Sombras:\*\* Utiliza colores modernos con buen contraste. Prefiere bordes sutilmente redondeados y sombras suaves y difusas para dar profundidad a las tarjetas de productos, evitando el aspecto anticuado o "por defecto".



\## 4. Skill: Superpowers (Ingeniería Contextual y Stack)

\- \*\*Anticipación:\*\* Antes de escribir código, prevé casos extremos (estados de carga, manejo de errores, datos vacíos en el carrito).

\- \*\*Stack Moderno:\*\* Aplica buenas prácticas de React y estilos limpios en el frontend.

\- \*\*Componentización:\*\* Escribe componentes modulares, reutilizables y de responsabilidad única (SOLID).



\## 5. Skill: Graphify \& Relaciones de Datos

\- \*\*Mapeo de Entidades:\*\* Cuando se discutan bases de datos, catálogos o diagramas ER, utiliza un enfoque estructurado para organizar las relaciones de datos de forma lógica y escalable antes de implementar el código.


## Al iniciar sesión
- Lee en este orden: CLAUDE.md, avances.md (sección "Resumen" y "Frontend (Hito 2)"), PRODUCT.md y DESIGN.md, graphify-out/GRAPH_REPORT.md (sin leer graph.json completo; para dudas puntuales usa `graphify query`, `graphify path` o `graphify explain`) y CONTEXTO-BRINDA.md solo en las secciones 18 y 19. Lee FRONTEND-BRIEF-BRINDA.md (secciones 6, 9, 10 y 11) solo si vas a tocar el diseño, y backend/ENDPOINTS.md solo si hace falta (no inventes rutas ni campos).
- Para levantar el entorno local (Docker, backend, frontend) sigue `readme.md`. Al empezar, los servicios suelen estar apagados.
- Resume en máximo 12 líneas: estado, qué se hizo, qué sigue y decisiones tomadas; después espera la indicación del usuario.

## Al terminar una tarea
- Actualiza avances.md: qué se hizo, qué queda, decisiones nuevas.

## Reglas de seguridad y alcance
- Nunca generes, inventes ni imprimas secretos (.env, DNI_ENCRYPTION_KEY, JWT, contraseñas).
- No hagas commit ni push sin que el usuario lo pida.
- No ejecutes nada destructivo sobre la BD sin confirmación.
- No toques .claude/ ni las skills sin avisar.
- No inventes productos, precios, promociones, horarios, distritos, números de WhatsApp/Yape/Plin ni textos legales: esperan datos de Lucía y del asesor. Los datos de ejemplo (`core/catalog.mock.ts`) solo existen como herramienta de diseño, con la bandera `brinda.mock` en desarrollo, y nunca en producción.
- No toques la paleta, las tipografías ni el botón fantasma del hero (fijados por el brief). El burdeos es solo para botones de pedir.
- No instales dependencias nuevas sin consultar. No mates procesos por nombre (`taskkill /IM node.exe`): detén solo el proceso por su puerto.
- Verifica toda pantalla a 360, 768 y 1440 px y corre `npx ng test --no-watch` y `npx ng build` antes de dar algo por terminado.
