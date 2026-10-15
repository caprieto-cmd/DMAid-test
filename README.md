# DM.AID · Motor de reglas raciales · Fase 9

**Ámbito:** D&D 5e 2014–2023; biblioteca de referencia PHB 2014 + MPMM 2022. **No contiene reglas 2024**.

## Contenido
- `races.pre2024.normalized.v7.json`: biblioteca intacta de fase 8.
- `racial-engine.js`: motor puro UMD (navegador `window.DMAidRacialEngine`; Node `require`). No modifica campañas, ni `localStorage`, ni fichas existentes.
- `test-engine.js`: 12 pruebas automáticas.

## Ejemplo de integración
```js
const data = await fetch('./races.pre2024.normalized.v7.json').then(r=>r.json());
const result = DMAidRacialEngine.resolve(data, {
  raceId:'race.phb2014.human.variant',
  level:1,
  choices: {
    abilityIncreases:{DES:1,CON:1},
    'race.phb2014.human.variant/skill-proficiency-(choice)':['Percepción'],
    'race.phb2014.human.variant/feat-(choice)':['Alert']
  }
});
// result.abilityIncreases, result.proficiencies, result.pendingChoices, result.traits ...
```

## Contrato
El motor **deriva**, no guarda. Debe ejecutarse siempre sobre las elecciones originales al recalcular una ficha. La selección de raza se identifica mediante ID estable, no mediante un nombre traducido. Las subrazas heredan rasgos del padre, pero `fixed_total` sustituye el incremento del padre. Los efectos que no deben aplicarse permanentemente aparecen en `conditionalEffects` u `otherEffects` con su procedencia.

`pendingChoices` exige decisiones del creador y `errors` exige corregir entradas inválidas. La aplicación NO debe permitir confirmar una ficha con estos elementos pendientes.

### Límites actuales
- Efectos pasivos modelados: incremento racial, competencias declaradas, sentidos, resistencias, inmunidades, velocidad, armas naturales, bono de PG por nivel.
- Conjuros raciales: lectura declarativa de progresión y niveles. No actualiza todavía el gasto de espacios ni el inventario de recursos de combate.
- Recursos: genera **definiciones estables y claves de seguimiento**; un gestor de combate deberá controlar sus usos y descansos, sin reinicializarlos al recalcular la ficha.
- Modificadores condicionales (CA de Tortle, transformaciones, ventajas, requisitos de armadura), acciones, reacciones y habilidades especiales: **conservados como datos**, no ejecutados automáticamente. Requieren reglas adicionales.
- Opciones variables como rasgos de subraza y dotes: detecta selecciones y almacena su efecto declarativo, pero no sustituye el futuro motor de dotes ni valida todos sus prerrequisitos.
- Cobertura limitada a los 53 registros que están en la fuente V7. No implica totalidad de material anterior a 2024.
- La fuente V7 contiene algunos campos parciales que requieren validación cláusula por cláusula. No debe asumirse que todas las mecánicas están certificadas.

## Pruebas
`node test-engine.js`

**No subir a GitHub aún:** este es un módulo de desarrollo desacoplado, no una versión desplegable de DM.AID.
