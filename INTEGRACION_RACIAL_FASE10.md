# DM.AID TEST 1.18.3 · Integración racial fase 10

Integración experimental de la biblioteca racial normalizada V7 (53 registros pre-2024) y motor puro `racial-engine.js` con Character Builder V2.

## Alcance implementado
- Carga de la biblioteca como JSON independiente al abrir el creador, con error explícito ante falta de archivos.
- Selector por IDs y fuente; distinción de subrazas PHB y especies MMotM 2022.
- Bonos raciales obtenidos del motor, incluyendo Humano variante y distribución +2/+1 o +1/+1/+1 de MMotM.
- Competencias raciales fijas consolidadas por el motor, sin recontar las de clase.
- `sheet.creationV2.racialSourceId` y `sheet.creationV2.racialResult` guardan procedencia y salida del motor, junto con las elecciones.
- Motor y biblioteca cacheados con identificador 1.18.3.

## Limitaciones explícitas
- Los efectos condicionales, ataques, reacciones y consumos no están conectados todavía al sistema de combate.
- Algunas razas necesitan elecciones especiales adicionales. Se enumeran como pendientes, sin concederlas automáticamente.
- Se mantiene código heredado para rasgos de clase, trasfondos, equipo y dotes. La integración total se realizará después de validar las bibliotecas correspondientes.
- Las hojas anteriores no se migran, y no se ha validado el flujo real en Safari/iPhone.
- En algunas razas la redistribución opcional de Tasha podría requerir más refinamiento, ya que el motor conserva sus incrementos como datos de fuente.

## Instalación
Extraer **todo** el ZIP en la raíz del repositorio TEST, incluyendo JSON, engine.js, CSS, builder.js, index.html y sw.js. GitHub Pages debe publicar JSON como archivo estático.
