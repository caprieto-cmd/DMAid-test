# Auditoría de limpieza: DMAid 1.18.4

## Confirmado

- 37 archivos en el ZIP fuente (sin contar el directorio raíz); 11 recursos de ejecución conservados y 1 nuevo README.
- `index.html` (~949 KB; 7.183 líneas) contiene 95 elementos `<script>`, la mayoría inline; 93 etiquetas sin `src`.
- Referencias de ejecución directas: `racial-engine.js`, `character-builder-v2.js`, `character-builder-v2.css`, iconos, marca, manifest, service worker y catálogo racial leído por el builder.
- Los archivos `races-mmotm.js` y `setup-libraries.js` no aparecen referenciados en el `index.html`, ni en los módulos JS cargados.
- Los compendios de bestias, conjuros y objetos se descargan dinámicamente desde `raw.githubusercontent.com/5etools-mirror-3/5etools-src/`. No están integrados en el ZIP.
- Se verificó con `node --check` la sintaxis de los bloques de scripts del HTML y JS conservados: sin errores de análisis.

## Deuda técnica y pendientes

- `index.html` mezcla numerosas áreas funcionales; se encuentran declaraciones duplicadas de `rollEnemyRechargeOnTurn`, `enemyRechargeHTML`, `enemyRechargeDefinitions`, `weaponProficientV154`, `proficientWithWeaponV154`, `conditionalEquipmentWarningsV154`, `dmaFeaturesHTML1110` y `save`. Estos son **nombres repetidos**, no prueba de código inalcanzable. No eliminarlos sin pruebas.
- El `README.md` original describía una fase racial anterior y mencionaba `test-engine.js`, ausente del ZIP recibido: se sustituyó por instrucciones actualizadas de prueba.
- Riesgo de caché: el SW utiliza versión `dmaid-test-1.18.4`, se recomienda cambiar versión al hacer futuros despliegues.
- Riesgo por carga externa: la app requiere red para importar ciertos catálogos que no vienen empaquetados.
- La auditoría NO certifica reglas, persistencia, conexiones, flujos de usuario, ni ausencia de errores lógicos. Requiere prueba en navegador.

## Cambios de este paquete

Solo se retiraron archivos no utilizados en la carga conocida y documentos/pruebas de desarrollo del paquete de despliegue. Se mantuvieron los módulos y HTML exactamente como estaban, sin refactorizar, para que el resultado de la prueba sea comparable con el original.
