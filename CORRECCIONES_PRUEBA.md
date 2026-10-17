# DMAid · Corrección aislada para pruebas (2026-10-17)

## Cambios aplicados
- Nuevo selector de competencia racial en el primer paso del creador V2, usando las opciones del catálogo racial y guardando el resultado mediante el identificador exacto que consume el motor.
- La validación impide avanzar si falta elegir una competencia racial.
- El resultado de la elección se integra a la contabilidad de competencias de la ficha.
- No se duplica el texto complementario cuando coincide exactamente con la descripción, tanto en el creador como en el panel racial.
- Actualización de los identificadores del creador y de la caché del Service Worker.

## Verificación
- Sintaxis JavaScript comprobada con Node.
- Motor racial probado con Tortle MMotM: elegir `Perception` genera competencia sin elecciones pendientes.
- No se ha ejecutado un navegador ni se han probado los flujos completos de creación/combate.

## Pendiente, NO corregido en esta entrega
- Pendiente de confirmar sincronización visual de Stone's Endurance entre los distintos paneles. El botón existente ahora registra también la reacción como gastada; la recuperación de la reacción sigue independiente de los usos raciales.
- Visualización mecánica de Dueling y otros estilos de combate.
- Contadores de Second Wind (Bonus Action) y Action Surge (acción adicional de ataque/acción, NO bonus action).
- Revisión completa de otros rasgos raciales con elecciones no relacionadas con competencias.

Mantén copia de seguridad y prueba en la rama experimental.
