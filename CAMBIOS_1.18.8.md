# DMAid 1.18.8 — Referencias de magia en combate

- En el panel derecho de «Espacios de conjuro» se añade una lista desplegable de los conjuros y trucos efectivamente asignados al personaje, incluidos los conjuros de dominio del clérigo. Al elegir una entrada se muestra la información indexada disponible. Consultar no gasta espacios.
- En «Ataques y acciones durante el turno» se presentan los trucos de combate conocidos como entradas desplegables. Thorn Whip incluye ataque d20 + bonificador de conjuro, alcance 30 pies, 1d6 perforante a niveles 1-4 (escalando en 5/11/17), y posible arrastre 10 pies de objetivos Grandes o menores, con el rasgo abierto inicialmente.
- Las descripciones limitadas del catálogo se identifican como resúmenes, no como textos completos.
- Se mantiene el registro manual de espacios mediante círculos, sin tiradas automáticas ni gasto al consultar.
- Versión visible 1.18.8. Nueva entrada estática dma-combat-spells-1188.js y actualización del service worker.

## Verificación
- Sintaxis de 96 scripts internos de index.html, dma-combat-spells-1188.js y sw.js: correcta.
- Sin prueba completa en Opera GX ni certificación funcional en navegador.

## Prueba sugerida
1. Abrir ficha de Thalion en «Iniciativa y combate» y elegir su turno.
2. Abrir «Ataques y acciones»: Thorn Whip debe mostrar ataque +5, daño 1d6 perforante y alcance 30 pies.
3. En «Espacios de conjuro», seleccionar Healing Word o Spike Growth. Deben aparecer los detalles disponibles; los espacios no deben cambiar por consultarlos.
4. Gastar un espacio con su círculo y verificar que el contador disminuye solo por esa acción.
