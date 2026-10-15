## 1.18.2 TEST
- Selector de dotes del Humano variante: buscador integrado y lista de opciones visible en Opera, Chrome y Safari.
- Conserva la selección en el registro único creationV2.

## 1.18.1 TEST
- Reparación del despliegue: versión visible actualizada, acceso al creador V2 y recursos con identificador de caché.
- Añadidos `sw.js` y `manifest.webmanifest`, ausentes del ZIP 1.18.0.
- Se conserva el motor original de combate y el asistente antiguo como respaldo.

## DM.AID TEST 1.18.0 · Nuevo creador V2 (fase inicial)
- Nuevo módulo aislado, seis etapas, registro único y exportación compatible.
- Sin alterar registros de personajes existentes ni lógica de combate.
- Los rasgos no normalizados del catálogo siguen pendientes de migración.

## v1.17.17 TEST
- Sincroniza la competencia del humano variante con el paso Habilidades, competencias y pericias.
- La habilidad se identifica como racial y no consume cupos de clase.
- Conserva la competencia al avanzar, retroceder y finalizar la creación.

## v1.17.17 TEST
- Competencias de salvación adicionales asignables por el DM.
- Cloistered Scholar (SCAG 2015), con su selección de competencia.
- Humano variante: dote y habilidad obligatorios al crear.
- Resilient: elegir característica para competencia en salvación.

## 1.17.17 · Alma de la forja
- Reconoce cota de malla y otras armaduras pesadas equipadas y añade +1 CA para Clérigo de la Forja nivel 6+.
- No duplica la bonificación al regenerar fichas ni la conserva en Forma salvaje.
- Mantiene el ajuste explícito de CA del DM.

DM.AID TEST 1.17.17: armas virtuales de Armorer mostradas una sola vez como ataques; la ficha se abre en el diálogo de inventario y Defensive Field conserva su contador.

## 1.17.13 · Las armaduras no son ataques
- Corrige la clasificación de inventario: armaduras, cotas de malla y escudos no pueden aparecer como ataques, aunque sus registros tengan campos de daño o tipos genéricos.
- Conserva los ataques de armas verdaderas y las armas especiales de Arcane Armor.
- Mantiene alineados la lista de ataques y el botón para consultar la ficha del arma.

## 1.17.13 · Reconocimiento de Arcane Armor equipada
- Corrige la detección de armadura equipada para el Artífice Armorer: consulta el mismo inventario y categoría normalizada que usa el cálculo de CA, en lugar de exigir solo códigos LA/MA/HA.
- El modo Guardián/Infiltrador sigue siendo una elección independiente; sus efectos se habilitan al llevar armadura real equipada.
- Ropajes y escudos no activan por sí solos la Armadura Arcana.

## 1.17.13 · Actualización inmediata de campaña
- Refresca tarjetas y statblock al abrir o continuar campaña, sin iniciar encuentro ni modificar turnos, PG o recursos.

## 1.17.13 TEST · Controlador de iniciativa compacto
- Eliminada en origen la inserción de la sección «Dotes de combate» en las tarjetas pequeñas de iniciativa.
- Conservadas las dotes en el statblock ampliado y en las hojas de personaje.
- Sin cambios en los modificadores de iniciativa, PG, controles de daño ni datos guardados.

## 1.17.9 TEST · Auditoría y limpieza conservadora
- Retirados únicamente comentarios CSS sin efecto en la ejecución.
- Conservados todos los scripts, selectores, declaraciones, renderizadores y estados.
- Auditoría estática de funciones superpuestas, selectores repetidos y puntos de riesgo en AUDITORIA_CODIGO_1179.md.
- No se eliminan candidatos de código muerto sin pruebas de navegador que demuestren que no son necesarios.

## 1.17.9 · Modal de reacciones
- Botón compacto en Daño rápido; reacciones de clase, raza, dotes y conjuros registrados.
- Contadores manuales persistentes; estado de reacción restaurado al inicio del turno propio.
- No lanza dados ni modifica PG automáticamente.

## 1.17.9 · Categorías plegables y diseño unificado

- Rasgos raciales, Rasgos de clase, Dotes y Ataques y acciones ahora comparten encabezado y comportamiento plegable.
- Se elimina el desplegable racial duplicado, preservando los controles originales, contadores y la lógica de combate.
- Las categorías comienzan plegadas y pueden abrirse independientemente.

## 1.17.9 · Limpieza de ataques y acciones

- Quita el segundo título de armas equipadas, las advertencias generales y la duplicación de Ataque furtivo.
- Mantiene estadísticas, detalle del arma y notas de otras clases no redundantes.

## 1.17.9 TEST
- Dotes: una entrada única por dote, con descripción y categoría, sin subrecuadros ni texto repetido.
- Se eliminan encabezados internos redundantes de los bloques raciales y de clase cuando corresponda.
- Sin cambios en reglas, tiradas ni persistencia.

## 1.17.4 TEST
- Combate: las dotes son solo de consulta; se retiraron controles para añadir o quitar dotes del statblock y de las tarjetas de iniciativa.
- Edición de dotes únicamente desde Hoja de personaje > Dotes > Editar dotes.

## 1.17.3 TEST
- Hoja de personaje: Dotes en un único apartado plegable, listado automático de dotes adquiridas y editor visible solo al pulsar Editar.
- Cálculo de CA integrado en Identidad y datos básicos, con ajuste explícito del DM conservado y Forma salvaje sin eliminar.

## 1.17.3 TEST
- Auditoría estructural racial y de rasgos de clase con CSV y estados explícitos.
- Rasgos raciales: un único desplegable, sin sub-desplegables individuales.
- No se atribuyen automatizaciones no verificadas.

## 1.17.3 TEST
- Rasgos raciales colapsables sin encabezado duplicado.
- Daño rápido: contador Stone’s Endurance para marcar usos sin tirar dados; botón de corrección.
- No calcula daño ni modifica PG automáticamente.

## 1.17.3 TEST
- Statblock del combatiente activo separado en Rasgos raciales, Rasgos de clase, Dotes y Ataques y acciones durante el turno.
- Los controles interactivos se trasladan, sin clonarlos ni reiniciar recursos.
- Alert se muestra en Dotes, no como distintivo del contador de iniciativa.

## v1.17.3
Corrección del asistente: guardar dotes elegidas antes de cerrar el asistente, reflejarlas automáticamente en ficha y combate; Alert +5 exactamente una vez al crear. Recuperación visual de elecciones ASI de personajes anteriores sin duplicar estadística de iniciativa.

## v1.17.3
Dotes visibles y editables desde TODAS las tarjetas de iniciativa, incluso si el personaje no tiene ninguna, y editor para el combatiente activo.

## v1.17.3
Corrección de visibilidad de dotes: editor persistente en cada ficha, sincronización con el statblock y soporte para personajes antiguos. No se duplican bonificaciones numéricas.

## 1.17.3: Dotes de combate
- Statblock con dotes de combate PHB 2014; Alert visible en tarjetas sin volver a sumar el bono ya almacenado.
- Rasgos condicionales informativos, no se automatizan usos ni reacciones.

## 1.17.3 TEST
- Corrige el contraste de todo el bloque de ataques naturales en combate: ataque, daño y notas, incluidos textos heredados de otros estilos.
- Cambio exclusivamente visual, sin alterar las estadísticas ni los ataques calculados.

## 1.16.9 TEST
- Ataques naturales raciales MMotM en el statblock de Iniciativa y combate para Aarakocra, Centaur, Lizardfolk, Minotaur, Satyr, Tabaxi y Tortle.
- Shifter Longtooth con requisito de transformación señalado.
- Ataque calculado con Fuerza + competencia y daño 1d6 + Fuerza; acciones especiales condicionadas separadas.
- No añade armas al inventario ni concede ataques adicionales.

## 1.16.9 TEST
- Botón «Iniciar combate» antes de «Siguiente turno»: refresca tarjetas y stat block, establece ronda 1 y turno del primero por iniciativa.
- No reinicia PG ni recursos; mantiene las acciones previas de siguiente/anterior.

## 1.16.9 TEST
- Regresión de CA en iniciativa: se recupera la CA base guardada como fórmula alternativa, sin reescribir valores ni estado.
- Respeta Wild Shape, armadura equipada y override de DM.

## v1.16.9 TEST · Auditoría racial
Revisión estructural del catálogo PHB y 33 especies MMotM. Datos comunes de velocidades, CA natural aplicable, desplazamientos especiales, visión, resistencias y rasgos visibles en combate. Advertencia explícita sobre efectos raciales aún manuales. Véase INFORME_AUDITORIA_RAZAS.md.

DM.AID TEST 1.16.9 · Guardian: Thunder Gauntlets y Defensive Field por separado, contador persistente por personaje y descanso largo; Infiltrator: habilidades detalladas.

## 1.16.9 TEST
- Editor de modificadores accesible desde todos los objetos del inventario.
- Selector Guardian/Infiltrator del Armorer y visualización táctica.
- Registro preliminar de elecciones en ciertas clases: no implica automatización completa de sus efectos.

## DM.AID TEST v1.16.9
- Motor de efectos no destructivo: objeto, estadística afectada, momento de activación y capacidad especial.
- Infusiones Tasha 2020: valores por nivel para Enhanced Defense/Weapon/Arcane Focus, Repeating Shot, Returning Weapon, Radiant Weapon, Repulsion Shield, Mind Sharpener y otras.
- Bonificaciones de CA y ataque/daño en hoja y combate; editor manual para otros efectos.
- Efectos especiales documentados sin automatizar tiradas, reacciones, cargas ni efectos condicionales.

## DM.AID TEST 1.15.0
- Libro de infusiones Tasha 2020 por nivel de Artífice, selección de conocidas y asignación a objetos.
- Replicate Magic Item separado por objeto específico y nivel requerido.
- Campo de notas del DM en cada objeto del inventario de todos los personajes.
- Sin automatización de los bonificadores mágicos ni de prerrequisitos físicos del objeto: revisión del DM.

## 1.15.0 TEST

- Contador de infusiones conocidas y activas según nivel de Artífice 2014-2023.
- Contador junto a espacios de conjuro y en la hoja de personaje; estado guardado por personaje.
- Rasgo Infundir objeto señalado como Infusión.

## 1.15.0 TEST
- Rasgos de Artífice (TCE 2020), especialidad Armorer y Dominio de la Forja (XGE) por nivel de cada clase.
- Clasificación de rasgos de clase y subclase; inclusión de rasgos mecánicos pertinentes en combate.
- Avisos específicos para subclases no cubiertas, sin advertencia genérica sobre Asesino.
- Las selecciones y efectos no quedan automatizados por registrar el rasgo.

## 1.15.0 TEST
- Ventana modal nativa de personajes dentro de su contenedor, eliminando la expansión accidental del directorio.
- Captura delegada de clic y teclado; conserva las hojas originales y los controles existentes.

## 1.15.0 TEST
- Reparación de apertura del personaje mediante interacción directa con la tarjeta.
- Diálogo que utiliza la hoja original y se reconstruye tras cerrar.
- Respaldo: si el diálogo falla se muestra la hoja desplegada.

## 1.15.0 TEST

- Corrige la apertura de hojas de personajes en ventana modal, conservando el elemento original y restableciendo el directorio al cerrar.
- Corrige la alineación de las filas de stock de tiendas en escritorio, iPad y móvil.

## 1.15.0 TEST
- Tarjetas de personajes abren ficha en ventana modal mediante delegación de eventos.
- Directorio permanece colapsado tras renderizados y edición.

## 1.15.0 TEST
- Personajes: tarjetas compactas que abren su hoja completa en una ventana modal.
- Conserva secciones plegables, bloqueo de edición e inventario editable.
- Reutiliza la misma ficha DOM sin duplicar controles ni IDs.

## 1.15.0 TEST

- Monedero de personajes: denominaciones identificadas por monedas de colores con nombres completos.
- Tiendas: filas de stock más compactas y distribución adaptable a escritorio, iPad e iPhone.
- Sin modificaciones en equivalencias, compras ni almacenamiento.

## 1.15.0 TEST
- Directorio de tiendas con tarjetas cuadradas.
- Tiendas en ventana modal y stock agrupado por tipo y ordenado por precio sin modificar los índices del inventario.
- Alineación compacta de nombres, unidades, precio y acciones.

## 1.15.0 TEST

- Retirar del stock guardado artículos identificados como 2024+, conservando una copia de las filas excluidas dentro de cada tienda.
- Excluir fuentes no verificadas en el selector de adición manual de tiendas; conservarlas en bibliotecas.
- Mantener control de versiones y caché.

## 1.13.23 TEST

- Filtrado conservador por fuente para surtidos 2014–2023; excluye XPHB/XDMG/XMM y referencias sin edición verificable.
- Ficha uniforme para tienda, inventario y biblioteca.
- Los datos sin fuente identificable permanecen intactos pero no entran en surtidos automáticos.
- Función de diagnóstico de ediciones disponible en consola: dmaItemEditionReport11323().

## 1.13.23 TEST

- Exclusión de registros sin datos sustantivos del surtido automático.
- Diagnóstico por tienda de registros omitidos y motivos.
- No altera el catálogo importado ni elimina artículos existentes.
- Los artículos incompletos siguen disponibles para revisión manual.

## 1.13.21 TEST

- Stock sugerido aleatorio y equilibrado entre las rarezas disponibles, respetando especialidad y límite de tienda.
- No se agregan otra vez los objetos que ya están en el stock; la selección sigue siendo editable.
- Códigos comunes de propiedades muestran nombres legibles y se elimina descripción duplicada en tiendas.
- Los datos originales JSON no se modifican.

## 1.13.21 TEST
- Conecta el renderizador de estadísticas JSON también a la ventana de tiendas.
- Fichas de tienda recuperan propiedades y campos adicionales del objeto sin modificar el registro importado.
- Las fichas de objetos sin descripción mantienen sus atributos técnicos visibles.

## 1.13.19 TEST
- Las fichas de objetos del catálogo y del inventario muestran sus estadísticas del JSON y datos adicionales no interpretados.
- Representación de entradas estructuradas, listas y tablas; sin alterar los objetos almacenados.

## 1.13.19 TEST

- Recargas compactas: título de panel eliminado y una fila por habilidad.
- Una habilidad gastada queda bloqueada; únicamente una tirada d6 al inicio de su turno la recupera.
- Indicador mínimo del último d6 y estado disponible.
- Conserva recargas 5–6 y 6, iniciativa y acciones legendarias.

## 1.13.17 TEST

- Compact legendary actions control in initiative cards.
- Modal detail for each legendary action, with cost and spending.
- Removed duplicate Legendary Actions section from active enemy stat block (original data retained).
- Default of 3 legendary points when no source total is declared.

## 1.13.17 TEST

- Eye Rays: numeración de 10 rayos desde listas estructuradas y alternativas de importación.
- Acciones legendarias: contador individual en tarjeta de iniciativa, costes y reinicio al comenzar turno.
- Cuando el total no figura en los datos, se usa provisionalmente el valor predeterminado de 3, señalado para revisión.

## 1.13.15 TEST

- Stat blocks activos: categorías Traits, Actions, Bonus Actions, Reactions, Legendary Actions y Mythic Actions desde los datos originales.
- Importación: eliminados dos recortes de 12.000 caracteres en textos resumidos; Mythic Actions incluidas en el resumen.
- Pruebas de regresión para detectar secciones ausentes y límites de texto.
- Sin cambios en la versión estable ni en las reglas de recarga.

## 1.13.14 TEST

- Empaquetado de rasgos y acciones cortas en dos columnas independientes, evitando espacios vacíos.
- Recuperación de los diez Eye Rays como lista numerada desde la estructura original de la biblioteca.
- Las acciones largas usan todo el ancho disponible.

## 1.13.14 TEST

- Restore original English wording in monster traits and actions from imported source data.
- Arrange long actions at full width rather than placing the complete block in one column.
- Preserve recharges, enemy stats, and player character interface.

## 1.13.12 TEST

- Restaura los diez efectos individuales de Rayos oculares del Contemplador desde la biblioteca original, sin reemplazarlos por un resumen.
- Mantiene sus valores mecánicos y muestra los nombres de los rayos en español, con la descripción original completa como respaldo.
- Conserva las columnas y las recargas.

## 1.13.12 TEST

- Rasgos y acciones individuales usan todo el ancho del stat block de enemigos, conservando dos columnas cuando hay varias entradas.
- Sin cambios en estadísticas ni funcionamiento de combate.

## 1.13.12 TEST

- Todas las fichas de enemigos ocupan el ancho completo del panel.
- Rasgos y acciones siempre usan dos columnas en pantallas amplias, sin requerir stat block extenso.
- En pantallas estrechas se conserva una columna. Los personajes jugadores no cambian.

## 1.13.12 TEST

- Los stat blocks extensos de enemigos ocupan todo el ancho del panel de combate, sin reservar espacio para los conjuros de personajes.
- En pantallas grandes se mantienen dos columnas internas, en teléfonos una sola.
- Sin cambios en la lógica de combate, recargas o almacenamiento.

## 1.13.8 TEST

- Traducciones mecánicas revisadas para rasgos y acciones seleccionadas de 8 criaturas ya comprobadas.
- Stat blocks extensos con columnas automáticas en PC/iPad horizontal; una columna en móvil.
- Datos importados, CD, dados, recargas y estado de combate permanecen sin cambios.
- Los rasgos no cubiertos conservan su texto original en inglés.

## 1.13.7 TEST

- Traducción verificada por bloque: las reglas sin traducción completa aparecen en su inglés original, sin mezcla de idiomas.
- Más plantillas completas para ataques múltiples, resistencias mágicas, regeneración y rasgos conocidos.
- Etiqueta discreta para textos pendientes; conserva CD, dados, duración y condiciones.
- Se conserva el sistema de recargas y los datos importados sin mutarlos.

## 1.13.7 TEST

- Rasgos independientes en stat blocks con datos estructurados.
- Traducción contextual de nombres, condiciones y descripciones comunes.
- Párrafos legibles en rasgos y acciones extensas.
- Recargas 1.13.5 preservadas.

## 1.13.5 TEST

- Corrige falsas recargas en Ataque múltiple y otras acciones cuya descripción incluye texto de habilidades distintas.
- Solo admite recarga declarada en el nombre o al inicio de la descripción propia.
- Conserva los indicadores y tiradas independientes para recargas genuinas.

## 1.13.5 TEST

- Restablece los controles de recarga en las tarjetas de enemigos del panel de Iniciativa y combate.
- Detecta las recargas desde acciones estructuradas importadas, incluso con etiquetas `{@recharge 5}`.
- Mantiene seguimiento de gastada/disponible por unidad, tirada de recarga al inicio de turno y soporte de recarga 6.

## 1.13.3 TEST

- Corrige traducciones parciales en acciones de monstruos y salvaciones.
- Normaliza Recarga 5 a Recarga 5–6.
- Traduce el título del monstruo en el panel de combate cuando existe traducción.
- No altera los datos originales de criaturas.

## 1.13.3 TEST

- Conserva referencias de dados/daño al procesar las fichas.
- Traducciones adicionales para mecánicas comunes y dragón de cristal joven.
- Acciones independientes en el panel de combate cuando hay stat block estructurado.
- Corrección de caché y versión.

## 1.13.3 TEST

- Interpretación de etiquetas internas de monstruos (`{@atk}`, `{@hit}`, `{@damage}`, `{@dc}`, etc.).
- Traducción al español de términos mecánicos habituales en fichas de bestiario y panel de combate.
- Conservación del contenido importado original y valores numéricos; los pasajes no reconocidos permanecen en idioma original.
- Caché de TEST actualizada.

## 1.13.3 TEST

- Biblioteca: agrupación visual por objeto y pestañas para versiones por fuente.
- Traducciones de nombres frecuentes (con nombre original visible); resto mantiene nombre inglés para evitar traducciones incorrectas.
- Combate: CD y ataque de conjuro desglosados por clase lanzadora y atributo, con soporte multiclase.
- Sin cambios destructivos en biblioteca ni inventarios.

## 1.12.13 TEST

- Fichas del inventario rediseñadas íntegramente en pergamino beige con texto granate oscuro, incluyendo encabezados, estadísticas y descripción.
- Se anulan los colores heredados de componentes oscuros exclusivamente dentro del cuadro de detalle de objetos.
- Actualización de caché de TEST.

## 1.12.12 TEST

- Biblioteca de objetos ahora en IndexedDB, con migración de localStorage.
- Restauración automática al iniciar y reutilización en todas las campañas de TEST.
- Cargas de objetos guardadas en segundo plano en almacenamiento persistente.
- No cambia datos de campaña ni bibliotecas de monstruos o razas.

## 1.12.11 TEST

- El selector de Pericia se oculta por completo cuando la clase y niveles no conceden cupos.
- El texto contextual de Pericia solo hace referencia a Pícaro o Bardo cuando el personaje incluye esas clases.
- Se conserva la auditoría de competencias y el resumen de sus fuentes.

## 1.12.11 TEST

- Mejora de contraste en la pestaña de Iniciativa y combate.
- Ajuste global de colores y textos en bloques de rasgos y acciones para evitar elementos poco legibles.
- Actualización de versión y caché para evitar que el navegador sirva la edición anterior.

## 1.12.11 TEST
- Sistema visual unificado para todas las secciones de la hoja desplegada: tipografía, fondos, bordes, botones, entradas, etiquetas y espacios.
- Métricas de PG y CA visualmente consistentes; atributos, habilidades, salvaciones e inventario alineados con la misma paleta.
- Sin cambios en reglas, datos persistentes, directorio de tarjetas o interfaz de combate.

## 1.12.11 TEST
- Hoja de personaje desplegada centrada, con ancho máximo del 50% de la ventana en PC y iPad (desde 700 px).
- Vista de ancho completo en teléfonos para conservar la legibilidad.
- Distribución interna adaptativa para evitar campos comprimidos al reducir el ancho.
- Las tarjetas cerradas, datos y cálculos no cambian.

## 1.12.11 TEST
- Oculta Armadura de mago en la hoja si el personaje no tiene una fuente reconocida para conjurarla.
- Retira el texto redundante de solo lectura de las secciones protegidas.
- Elimina los campos históricos de texto libre de Salvaciones, Rasgos y defensas, Acciones y ataques y Reacciones en Características y habilidades, manteniendo sus datos guardados para compatibilidad.
- Conserva secciones dedicadas, tarjetas compactas, inventario y bloqueos.

# DM.AID TEST 1.12.11

- Separación de rasgos: ficha de personaje completa y panel táctico solo con rasgos de combate.
- Filtro explícito por clase y nivel multiclase, incluyendo rasgos de Asesino de efecto en combate.
- Los ataques y datos del inventario se mantienen.
- Las subclases distintas de Asesino siguen sin cobertura completa.

## 1.9.10 TEST — 2026-10-14
- El creador muestra cuántas fichas de objetos tiene disponibles realmente en esta sesión.
- Añadidos recarga desde almacenamiento, descarga del catálogo e importación de JSON sin abandonar la creación del personaje.
- Se explica la separación de bibliotecas entre TEST y la versión estable, evitando asumir una pérdida de datos.

## 1.9.10 TEST — 2026-10-14
- Selector de objetos mágicos de creación reconoce rarezas abreviadas y heredadas de fichas importadas.
- Mensajes con conteo de objetos coincidentes para diagnosticar bibliotecas vacías o fuentes sin rareza.
- Aislamiento de limpieza de caché de TEST para no eliminar cachés de la versión estable.

## 1.9.10 TEST — 2026-10-14
- Botón Eliminar por tarjeta compacta de personaje, con confirmación y sin desplegar la hoja.
- Conserva el flujo previo de eliminación y ajusta los índices de las tarjetas abiertas tras borrar.

## 1.9.10 TEST
- Fichas de objetos accesibles desde el inventario.
- Estadísticas de ataque y daño contextuales para armas del PHB.
- Se conservan los controles de equipamiento y cantidades.

## v1.9.10 TEST
- Armas independientes incluso cuando hay varias unidades iguales; equipar por unidad.
- Reconocimiento de armaduras en español, inglés y códigos de biblioteca; CA automática al equipar.
- Directorio de personajes en tarjetas cuadradas y hoja completa desplegable.

## 1.9.10 TEST
- Corrección de inventario de equipo inicial de trasfondos PHB 2014.
- Vinculación de elección de herramienta con el objeto inicial realmente concedido, incluyendo juegos de Soldado y Noble.
- Actualización del texto del asistente y protección al cambiar de trasfondo.

# DM.AID TEST 1.9.3

- Directorio de personajes con tarjeta plegable (nombre, raza, clases, nivel y CA).
- Herramientas de trasfondo con selector de opciones oficiales.
- Las competencias de vehículos oficiales de los trasfondos se mantienen.

# Historial DM.AID

## 1.9.2 TEST
- Un único botón de carga para las razas jugables integradas del PHB 2014 y MMotM 2022.
- Indicador de ambas fuentes activas y 33 especies MMotM.
- Importación JSON reservada para otras fuentes.
- Sin cambios en progresión, dotes, inventarios ni almacenamiento.

# Historial DM.AID

## 1.9.1 TEST
- Se restauran y blindan el catálogo MMotM (33 especies) y las Bibliotecas.
- Se integran las bibliotecas JS en HTML para no depender de archivos secundarios al abrir el creador.
- Botón permanente de Bibliotecas en la barra principal.
- Nueva caché PWA. Conserva las dotes de 1.9.0 y el almacenamiento previo.


## 1.9.10 TEST
- Los juegos/herramientas escogidos en Trasfondo ya no se vuelven a solicitar en Equipamiento.
- Las alternativas que conceden dos armas a elección presentan dos selectores independientes y guardan ambos objetos concretos en el inventario.
- Se reinician las selecciones pendientes al cambiar de alternativa de equipo.

## 1.11.0 TEST
- Carga automática de la biblioteca de objetos al abrir el creador con caché local y recuperación sin pasos manuales.
- Panel de auditoría de competencias de habilidades y expertise según clase inicial, trasfondo y algunas razas; avisos de sobreselección y limitaciones explícitas.

## 1.11.0 TEST
- Selector guiado de habilidades de clase con cupos, habilidades de trasfondo y origen visible.
- Pericias separadas y aviso de competencias del Pícaro Asesino.


DM.AID TEST 1.11.0: Rasgos por nivel de Pícaro PHB 2014 y Asesino; acciones de armas equipadas en el stat block activo de iniciativa y hoja.

## 1.12.0 TEST
- Resumen de rasgos de las doce clases PHB 2014 según nivel individual por clase para multiclase.
- Recursos selectos y ataques adicionales sin acumulación indebida.
- Subclases distintas de Asesino aún no descritas exhaustivamente; conjuros y habilidades de subclase deben revisarse.


## 1.12.11 TEST
- Directorio de personajes en tarjetas compactas casi cuadradas y distribución en columnas.
- Al tocar una tarjeta se despliega la hoja completa a ancho disponible.
- Rasgos de clase y ataques se insertan dentro de la hoja desplegada, no fuera.
- Se conserva el estado de las tarjetas al refrescar y el botón de eliminación individual.


### 1.12.11 TEST
- Secciones plegables, inventario abierto y editable, otras secciones bloqueadas por defecto.
- Velocidad racial automática, con rasgos de monje, bárbaro y dote Mobile; posibilidad de ajuste manual autorizado.

## 1.12.11 TEST
- Salvaciones automáticas por clase inicial PHB 2014, atributos y competencia global; multiclase no duplica competencias. Monje 14 (Alma diamante) y Resilient cuando está registrada.
- Eliminada sección Administración redundante de la hoja expandida.
- Conjuros ocultos para personajes sin magia reconocida; se conservan para lanzadores y fuentes raciales/dotes detectadas.

### 1.12.11 TEST
- Densidad visual adaptativa en las hojas abiertas: atributos, campos, competencias, salvaciones, espacios e inventario.
- Se preservan tarjetas compactas, colapsables, edición protegida, cálculos y datos.
- Nota contextual actualizada en Hojas de personajes.


1.16.9: Motor CA por fórmulas excluyentes, armadura natural racial, override DM y Forma salvaje manual controlada.

1.16.9: Corrige ropa confundida con armadura, Tortle y selección exclusiva de fórmula real de CA.


## v1.17.3
- Rasgos raciales individuales desplegables dentro del statblock, con explicaciones de reglas disponibles, elecciones y avisos para rasgos no verificados.
- Estilos de contraste específicos; mantiene controles activos en Acciones.


## 1.17.3
- Contadores independientes para lanzamientos raciales gratuitos.
- Restauración de usos raciales por descanso largo.
- Selección múltiple de competencias raciales.
