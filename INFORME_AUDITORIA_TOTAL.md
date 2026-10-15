# Auditoría general de rasgos · DM.AID TEST 1.17.0

## Alcance realmente comprobado

- 33 especies del catálogo MMotM 2022, con **135 entradas de rasgos** identificadas por inspección del código.
- 12 grupos de clase en el catálogo de rasgos relevantes para combate, con 93 menciones de rasgos. Esta cuenta **no certifica todas las subclases ni niveles**.
- Las razas principales y subrazas PHB 2014 se mantienen en otros catálogos/ramas del creador. **No hay demostración de cobertura mecánica completa**.
- Se inspeccionó el flujo de Rasgos raciales → statblock, Dotes → statblock, Rasgos de clase → statblock, y Daño rápido → controles reactivos.

## Hallazgos

1. Los rasgos MMotM poseen nombres en el catálogo, pero en general no tienen estructuras mecanizadas que expresen activación, usos, recarga, gasto de reacción ni efecto final. Mostrar un nombre no equivale a implementar una habilidad.
2. `Stone’s Endurance` tiene un contador específico en Daño rápido; marca uso y el jugador tira. No aplica daño por sí mismo. **La recuperación automática por descanso no está conectada de forma general**.
3. *Uncanny Dodge*, *Shield*, *Defensive Duelist*, *Cutting Words*, *Silvery Barbs* y otros rasgos reactivos requieren condiciones diferentes; no es correcto equipararlos ni asignarles falsos cupos de uso.
4. Hay subclases fuera del conjunto con descripciones verificadas. El catálogo de rasgos de clase sigue siendo parcial. No se puede certificar una auditoría «total y completa» con solo el código existente.
5. El modelo anterior de Rasgos raciales tenía dos niveles de desplegables. Se corrigió para que **solo se pliegue la sección exterior**; las descripciones internas se muestran como filas normales.

## Ubicación propuesta de controles

- **Daño rápido:** reacciones desencadenadas al recibir daño (Stone’s Endurance, Uncanny Dodge, Defensive Duelist cuando corresponda), acciones defensivas y recursos pertinentes. El DM solo marca uso; los jugadores lanzan sus dados.
- **Acciones durante el turno:** acciones, acciones adicionales, ataques, conjuros y sus recursos.
- **Rasgos raciales / de clase / Dotes:** características intrínsecas, lectura de condiciones, sin edición de rasgos desde combate.
- **Pasivos:** velocidad, resistencias, armadura natural, iniciativa y defensa; aplicados en fórmulas verificadas, no sumados doble.

## Estado y límites

Esta entrega es una **auditoría estructural y corrección de presentación**, no la implementación certificada de cada rasgo de los libros. Los CSV señalan los rasgos detectados y su ubicación sugerida; *no comprobado* significa exactamente eso. No se introducen contadores inventados ni efectos de reglas no validadas.

## Próximas etapas necesarias para garantizar cobertura real

1. Normalizar los identificadores de todas las clases, subclases y variantes raciales y validar cada registro contra fuentes autorizadas.
2. Incorporar un esquema por rasgo: coste de acción, disparador, máximo de usos, recarga, origen, decisiones de jugador y efecto mecánico.
3. Probar por separado cada familia de habilidades con personajes sintéticos de diferentes niveles, incluyendo multiclase.
4. Validar persistencia entre combates, descansos y cambios de turno, y efectuar pruebas de interfaz reales en navegador.
