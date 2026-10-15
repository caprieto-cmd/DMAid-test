# Auditoría de razas de DM.AID TEST v1.16.4

## Resumen ejecutivo

* Catálogo base: 9 razas PHB 2014, varias subrazas y entrada personalizada.
* Catálogo MMotM 2022: 33 especies, todas cargadas en JavaScript.
* El catálogo MMotM registra nombres y características generales, pero señala `mechanicalCoverage: partial` en las 33 especies. Esta auditoría NO las certifica como plenamente automatizadas.
* Cambios v1.16.4: presentación común de rasgos en combate y hoja, velocidades raciales 35/40, información de desplazamiento/visión/resistencias y comparación de CA natural en Lizardfolk; permanece la lógica especial del Tortle.
* Limitaciones: recursos por descanso, capacidades especiales, condiciones, ataques naturales, daño, conjuros raciales, aptitudes, bonificadores condicionales y selección múltiple de algunas opciones siguen requiriendo implementación y pruebas.

## Matriz MMotM 2022

| Especie | Rasgos | Velocidad | Elecciones | Estado mecánico |
|---|---:|---:|---|---|
| Aarakocra | 3 | 30 | — | Parcial, revisión funcional pendiente |
| Aasimar | 5 | 30 | revelation | Parcial, revisión funcional pendiente |
| Bugbear | 6 | 30 | — | Parcial, revisión funcional pendiente |
| Centaur | 4 | 40 | skill | Parcial, revisión funcional pendiente |
| Changeling | 2 | 30 | skill | Parcial, revisión funcional pendiente |
| Deep Gnome | 4 | 30 | — | Parcial, revisión funcional pendiente |
| Duergar | 4 | 30 | — | Parcial, revisión funcional pendiente |
| Eladrin | 5 | 30 | season | Parcial, revisión funcional pendiente |
| Fairy | 2 | 30 | — | Parcial, revisión funcional pendiente |
| Firbolg | 4 | 30 | — | Parcial, revisión funcional pendiente |
| Air Genasi | 4 | 35 | — | Parcial, revisión funcional pendiente |
| Earth Genasi | 3 | 30 | — | Parcial, revisión funcional pendiente |
| Fire Genasi | 3 | 30 | — | Parcial, revisión funcional pendiente |
| Water Genasi | 5 | 30 | — | Parcial, revisión funcional pendiente |
| Githyanki | 3 | 30 | — | Parcial, revisión funcional pendiente |
| Githzerai | 3 | 30 | — | Parcial, revisión funcional pendiente |
| Goblin | 4 | 30 | — | Parcial, revisión funcional pendiente |
| Goliath | 3 | 30 | — | Parcial, revisión funcional pendiente |
| Harengon | 4 | 30 | — | Parcial, revisión funcional pendiente |
| Hobgoblin | 4 | 30 | — | Parcial, revisión funcional pendiente |
| Kenku | 3 | 30 | — | Parcial, revisión funcional pendiente |
| Kobold | 3 | 30 | legacy | Parcial, revisión funcional pendiente |
| Lizardfolk | 6 | 30 | skill | Parcial, revisión funcional pendiente |
| Minotaur | 4 | 30 | — | Parcial, revisión funcional pendiente |
| Orc | 4 | 30 | — | Parcial, revisión funcional pendiente |
| Satyr | 4 | 35 | — | Parcial, revisión funcional pendiente |
| Sea Elf | 7 | 30 | — | Parcial, revisión funcional pendiente |
| Shadar-kai | 6 | 30 | — | Parcial, revisión funcional pendiente |
| Shifter | 3 | 30 | shift,skill | Parcial, revisión funcional pendiente |
| Tabaxi | 5 | 30 | — | Parcial, revisión funcional pendiente |
| Tortle | 5 | 30 | skill | Parcial, revisión funcional pendiente |
| Triton | 6 | 30 | — | Parcial, revisión funcional pendiente |
| Yuan-ti | 4 | 30 | — | Parcial, revisión funcional pendiente |

## Defectos confirmados en el código anterior

1. MMotM guardaba `speed` en `racialMetadataV170`, pero el stat block mostraba solamente `sheet.speed`, por lo que una especie con velocidad 35/40 podía aparecer con 30.
2. `naturalAC` estaba presente para Tortle y Lizardfolk, pero solo se añadió una adaptación específica para Tortle en v1.16.3.
3. La vista de combate no integraba sistemáticamente visión, resistencias, movimientos especiales y opciones raciales.
4. Las elecciones de varias opciones (`count:2`, p. ej. Changeling) se mostraban en un `<select>` de selección única.
5. El creador copiaba directamente algunas competencias prefijadas; no todas las elecciones se validaban y se aplicaban a los campos finales.
6. El catálogo MMotM incluye descripciones de rasgos solo por nombre, no datos suficientes para automatizar todos sus efectos.
7. PHB 2014 incluye mejoras de atributo y variantes parciales, pero no dispone de un catálogo normalizado y exhaustivo de rasgos raciales equivalente al de MMotM.

## Estado de certificación

✅ Catálogo enumerado y parseado: 33/33 entradas MMotM.
✅ Datos mínimos validados en pruebas estáticas: nombre, velocidad, rasgos, fuente, duplicados.
⚠️ Enlace con interfaz de combate reforzado. Sin prueba interactiva real en Safari.
❌ 0/33 especies MMotM certificadas como completamente automatizadas. Esto no significa que ningún rasgo funcione, sino que no están implementados y probados todos los rasgos de cada especie.
⚠️ Variantes PHB 2014: catálogo parcialmente modelado, falta auditoría mecánica individual.

## Siguiente fase necesaria para certificación completa

Implementar un catálogo de efectos de cada rasgo con activación, duración, consumo, recarga, nivel, prerrequisitos y aplicación al stat block; pruebas automatizadas para cada raza en nivel 1, 3, 5, 11 y 17, así como equipamiento y condición. Debe contrastarse contra textos autorizados de PHB 2014 y MMotM 2022 para garantizar equivalencia exacta.
