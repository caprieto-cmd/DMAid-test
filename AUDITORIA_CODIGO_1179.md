# Auditoría técnica de DM.AID TEST 1.17.8

## Resumen medible

- HTML principal original: **858,465 caracteres**.
- **85 bloques JavaScript** y **104 bloques CSS**.
- **601 nombres de funciones declaradas** mediante `function`; **7 nombres repetidos**. Esta cifra no incluye todas las reasignaciones dinámicas (`renderX = function`).
- **1080 selectores CSS diferentes**, **54 repetidos** en múltiples reglas. Repetición no equivale a inutilidad: cuenta la cascada y el contexto.
- **49 comentarios CSS** retirados en la limpieza conservadora.
- HTML nuevo: **854,685 caracteres**; ahorro aproximado de **3,780 caracteres** antes del cambio de versión.

## Evidencia de deuda técnica

El sistema agrega parches por versión y modifica funciones de renderizado mediante envoltorios. Eso hace que una función aparentemente obsoleta pueda seguir siendo invocada indirectamente. Eliminarla mediante búsqueda textual produciría regresiones en fichas, iniciativa o inventario.

### Funciones declaradas más de una vez

- `conditionalEquipmentWarningsV154`: bloques JS 13, 15.
- `dmaFeaturesHTML1110`: bloques JS 27, 28.
- `enemyRechargeDefinitions`: bloques JS 1, 38.
- `enemyRechargeHTML`: bloques JS 1, 38.
- `proficientWithWeaponV154`: bloques JS 13, 15.
- `rollEnemyRechargeOnTurn`: bloques JS 1, 38.
- `weaponProficientV154`: bloques JS 13, 15.

### Selectores con varias reglas (principales)

- `#sheetsplayers .dma-sheet-fold[open]>summary`: 4 reglas.
- `.eld-enemy-actions`: 4 reglas.
- `.eld-init-panel`: 4 reglas.
- `.eld-init-panel .eld-initiative-toolbar`: 4 reglas.
- `#sheetsplayers .dma-sheet-fold:not([open])>summary`: 3 reglas.
- `#sheetsplayers.sheetgrid`: 3 reglas.
- `.dma-shop-modal-1140 .dma-shop-price-1141 .v22-price-input`: 3 reglas.
- `.dma-shop-modal-1140 .v20-shop-stock`: 3 reglas.
- `.dma-shop-modal-1140 .v20-shop-stock>span`: 3 reglas.
- `.eld-init-panel .eld-enemy-actions`: 3 reglas.
- `.eld-init-panel .eld-round-display`: 3 reglas.
- `.eld-init-panel .eld-turn-actions`: 3 reglas.
- `.eld-initiative-toolbar`: 3 reglas.
- `.eld-tabs-right`: 3 reglas.
- `#dma-item-dialog-197`: 2 reglas.
- `#eldaria-active-stat .dma-feat-item-1136 p,#eldaria-active-stat .dma-monster-action-1132 p`: 2 reglas.
- `#eldaria-active-stat .dma-original-eye-rays-11313 li`: 2 reglas.
- `#eldaria-active-stat .dma-original-eye-rays-11313 ol`: 2 reglas.
- `#sheetsplayers .dma-sheet-fold`: 2 reglas.
- `#sheetsplayers .dma-sheet-fold:not([open])>summary .dma-sheet-ac`: 2 reglas.
- `#sheetsplayers .dma-sheet-fold:not([open])>summary .dma-sheet-arrow`: 2 reglas.
- `#sheetsplayers .dma-sheet-fold:not([open])>summary .dma-sheet-delete-198`: 2 reglas.
- `#sheetsplayers .dma-sheet-full`: 2 reglas.
- `#sheetsplayers>article.sheet.dma-open-sheet`: 2 reglas.
- `.death-outcome b`: 2 reglas.
- `.death-saves`: 2 reglas.
- `.dma-shop-modal-1140 .dma-coin-select-1141`: 2 reglas.
- `.dma-shop-modal-1140 .dma-shop-cell-1141`: 2 reglas.
- `.dma-shop-modal-1140 .dma-shop-price-1141 .v22-price-summary`: 2 reglas.
- `.dma-shop-modal-1140 .v20-shop-stock .red.small`: 2 reglas.
- `.dma-splash`: 2 reglas.
- `.eld-init-panel .eld-enemy-actions>.eld-wave-next`: 2 reglas.
- `.eld-init-panel .eld-enemy-row`: 2 reglas.
- `.eld-init-panel .eld-more-actions`: 2 reglas.
- `.eld-init-panel .initlist`: 2 reglas.

## Qué se eliminó en 1.17.9

Exclusivamente comentarios dentro de etiquetas `<style>`. El contenido ejecutable JavaScript, las hojas de estilo activas y su orden se mantienen. Se comprobó que cada bloque de declaraciones CSS permanece equivalente y que todos los scripts inline superan `node --check`.

## Candidatos que NO se eliminan sin pruebas funcionales

1. Versiones antiguas de renderizadores de hojas, tienda, combate y daño rápido: pueden ser llamadas por las capas posteriores.
2. Reglas CSS con mismo selector: pueden depender de la cascada, especificidad, media queries o `!important`.
3. Funciones declaradas repetidas: no necesariamente están muertas si hay referencias o cierres conservando la original.
4. Compatibilidad de datos antiguos (personajes previos, cambios de versión, inventarios, memorias de campaña). Eliminarla podría perder funcionalidad en partidas existentes.
5. Controles de reacción, raza, magia y CA: la revisión de sintaxis no demuestra su funcionamiento.

## Pruebas necesarias para una segunda fase de limpieza real

- Prueba de navegación y edición en las vistas de Personajes, Tiendas y Combate.
- Creación de personaje con dotes, multiclase y selecciones raciales, más recarga de página.
- CA de Tortle/Lizardfolk, equipo, escudos y Wild Shape; actualización inicial y por turnos.
- Reacciones y contadores (Stone's Endurance, Flash of Genius) y recuperación al comenzar el siguiente turno.
- Inventarios con notas, objetos encantados e infusiones entre personajes.
- Guardado/restauración de campañas antiguas y modo offline/PWA en iPad.

**Estado:** auditoría estática completa sobre el HTML; limpieza limitada deliberadamente para no asumir que código aparentemente redundante carece de efectos. No se certifica equivalencia funcional integral hasta disponer de pruebas de interfaz y regresión.
