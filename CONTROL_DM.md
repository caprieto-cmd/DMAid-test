# Control de rasgos raciales para el DM

## Implementado en esta iteración
- Panel de rasgos raciales de personajes creados con el nuevo asistente V2.
- Descripciones del catálogo en la ficha y controles de registro manual.
- Contadores para efectos con límite numérico expresado en el JSON y recarga al descanso.
- Estado de reacción del turno registrado manualmente.
- Controles accionables en la vista de iniciativa, además de la ficha.
- Shell Defense reutiliza el control y CA existente sin aplicar una segunda bonificación.
- Referencias de movimientos del motor racial y advertencia de velocidad cero en Shell Defense.
- Persistencia en `sheet.dmRacialTrackingV1` con el sistema de guardado de DMAid.

## No implementado / requiere pruebas adicionales
- NO todos los 184 rasgos poseen efectos con usos estructurados; algunos contadores no son inferibles con seguridad y no se fabrican.
- NO se automatizan otras modificaciones de CA o velocidad de estados no modelados previamente.
- NO se descuenta automáticamente un espacio de conjuro por el uso de un rasgo racial.
- NO se integra el consumo de acciones en todas las rutas del sistema de combate ni se modelan duraciones por ronda.
- NO se probó extremo a extremo en navegador.
- Las fichas legacy sin creationV2 requieren migración o selección racial compatible.
- Esta etapa implementa una base funcional de seguimiento, NO certifica el catálogo completo.

Pruebas manuales sugeridas: crear Goliath MMotM nivel 5, gastar tres usos de Stone’s Endurance, guardar y recargar, gastar reacción, pasar turno, descanso corto/largo. Crear Tortle, activar y desactivar Shell Defense y comprobar CA/velocidad.
