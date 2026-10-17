# DMAid 1.18.5 · Magia editable y descanso largo

- Editor en Hojas de personajes para seleccionar y quitar trucos, conjuros preparados y conocidos desde el catálogo. Abre automáticamente la sección después de crear un personaje en el creador V2.
- Conjuros del Dominio del Conocimiento de clérigo se muestran automáticamente como siempre preparados según su nivel. No cuentan en el límite normal de preparación.
- Cupos de trucos y preparación calculados para las principales clases lanzadoras. El límite de conjuros conocidos en bardos, brujos, hechiceros y casos multiclase avanzados aún requiere validación más extensa.
- Registro manual de espacios gastados, concentración, y descanso largo desde la ficha. El descanso restablece los PG al máximo, retira PG temporales, repone espacios normales y de pacto, limpia concentración y restaura los recursos raciales que ya siguen el motor existente.
- Recuperación de dados de golpe: si la hoja registra hitDiceSpent1185, recupera hasta la mitad del nivel (mínimo uno).
- Se conserva la selección de conjuros al descansar.
- Edición guardada en sheet.dmaMagic1185 y lista de compatibilidad sheet.spells.
- Actualización del service worker.

## Alcance y límites verificados
Se comprobaron sintaxis del módulo añadido, del creador V2, del service worker y de 95 scripts internos.
No se completó prueba de interfaz gráfica: el navegador de prueba impidió acceder a localhost.
El catálogo incorporado en el paquete contiene resúmenes y puede ampliarse en Compendio de conjuros; algunos conjuros necesarios para los personajes se ofrecen como entradas básicas de respaldo sin descripción completa. Los efectos, rituales y restricciones particulares no se automatizan completamente.
Los antiguos contadores de algunas habilidades de clase aún no están unificados con descanso largo. Asegura revisión manual de esos contadores.
La edición de magia se abre al finalizar la creación, no como una nueva etapa dentro del asistente.
