DM.AID TEST 1.17.11: las tarjetas del controlador de iniciativa ya no muestran «Dotes de combate». Los rasgos se mantienen en el statblock completo y la hoja.

DM.AID TEST 1.17.9: statblock compacto. Dotes sin títulos, resúmenes ni descripciones duplicadas; controles de combate conservados.

DM.AID TEST 1.17.4: dotes solo de consulta en combate; edición exclusiva en hojas de personaje.

DM.AID TEST 1.17.3 · Guardian: Thunder Gauntlets y Defensive Field por separado, contador persistente por personaje y descanso largo; Infiltrator: habilidades detalladas.

### Corrección 1.17.3

Las tiendas son exclusivamente para objetos con fuente verificada de 2014–2023. Al abrir el directorio se retira del stock cualquier objeto marcado 2024+, pero se archiva en `excluded2024StockV11324` dentro de la tienda para no perder el registro. La biblioteca no cambia.

## 1.13.23 TEST

El surtido automático omite candidatos sin estadísticas ni descripción sustantivas y ofrece un diagnóstico. La verificación exhaustiva de todos los registros requiere exportar el JSON real de la biblioteca.

## 1.13.21 TEST
- Fichas de objetos ampliadas con características conservadas del JSON.

DM.AID TEST 1.13.21: controles de recarga compactos, bloqueo de habilidades gastadas y tirada d6 automática al comienzo del turno.

## Integridad del bestiario · 1.13.15 TEST

El panel del monstruo activo intenta representar las seis categorías estructuradas. Si una fuente solo trae texto plano, se conserva la vista de respaldo sin garantizar separación de categorías. Las tablas y estructuras inusuales necesitan validación adicional. Ejecutar `node tests_statblocks_11315.cjs` y revisar el informe de auditoría previo.

## DM.AID TEST 1.13.14

- Monster stat blocks display original English titles and rules, retaining all mechanics.
- Long attack entries such as Eye Rays span both columns.
- Short actions use the two-column layout.
- Player character blocks unchanged.

DM.AID TEST 1.13.12: fichas extensas de enemigos a ancho completo en combate.

DM.AID TEST v1.13.8: traducciones revisadas por rasgo y fichas extensas en dos columnas.

## 1.13.7 TEST

Rasgos del bestiario separados por nombre, traducción mecánica ampliada y texto extenso distribuido en párrafos. Conserva el texto fuente original y los controles de recarga. Las reglas no reconocidas permanecen en idioma original, para evitar alteraciones no verificadas.

DM.AID TEST v1.13.3. Traducción de nombres seleccionados; las descripciones de fuentes importadas no se traducen automáticamente.

**Versión actual: 1.12.13 TEST**. La ficha modal del inventario utiliza fondo beige y texto granate de alto contraste.

**1.12.12 TEST:** los objetos se guardan en IndexedDB y se restauran al inicio. El almacenamiento pertenece al origen web de `DMAID-Test`: abrir archivos `file://` independientes o cambiar dominio/navegador no comparte bibliotecas. La migración desde localStorage es automática cuando aún existen los datos.

## Diseño 1.12.11 TEST
La hoja desplegada utiliza un sistema visual uniforme. Conserva el límite de ancho, las tarjetas compactas y los bloqueos de edición.

## Diseño de la ficha en 1.12.11 TEST
Las fichas abiertas quedan centradas y limitadas a la mitad de la ventana en PC/iPad. En pantallas de menos de 700 px usan todo el ancho.

# DM.AID TEST 1.9.10

**Nuevo:** pulsa el nombre de un objeto del inventario para ver su ficha, ataque, daño y propiedades cuando correspondan.


- Directorio de personajes con tarjeta plegable (nombre, raza, clases, nivel y CA).
- Herramientas de trasfondo con selector de opciones oficiales.
- Las competencias de vehículos oficiales de los trasfondos se mantienen.

# DM.AID 1.9.2 TEST

Actualización de la pantalla de Bibliotecas: **Cargar razas jugables (PHB 2014 y MMotM)** activa ambas fuentes ya integradas. **Importar otras razas (JSON)** es opcional. Se conserva el almacenamiento de TEST y la compatibilidad con las campañas anteriores.

Subir todos los archivos de esta carpeta a la raíz del repositorio DMAID-Test.


### 1.9.10 TEST
- Las elecciones de juegos, instrumentos y herramientas del trasfondo se convierten en artículos concretos del inventario al crear un personaje.
- Soldado: al elegir Dados, se añade Juego de dados, junto con insignia, trofeo, ropa y 10 po. La competencia con vehículos terrestres permanece.
- No se concede un juego físico a Criminal porque el equipo inicial de ese trasfondo no lo incluye, aunque sí tiene competencia en uno.
- Se evita reutilizar selecciones del trasfondo anterior al cambiarlo.


### Corrección TEST 1.9.10
Las competencias de trasfondo y el objeto inicial concreto se seleccionan una sola vez. Las armas marciales/sencillas que se obtienen en cantidad 2 requieren dos elecciones independientes.

## TEST 1.9.10
- Botón **Eliminar** directamente en cada tarjeta resumen de Personajes.
- Solicita confirmación antes de borrar. Usa el mecanismo de eliminación existente que también actualiza iniciativa y referencias por índice dentro de la campaña activa.
- No modifica el almacenamiento de campañas ni bibliotecas.

## TEST 1.9.10
- Corrección de filtros de rareza en objetos iniciales del creador de personajes.
- La lista indica cuántos objetos de esa rareza existen y si la biblioteca necesita cargarse.

## TEST 1.9.10
Si el selector de objetos mágicos indica biblioteca vacía, es posible recargar el catálogo almacenado, descargar el catálogo o importar directamente un archivo JSON desde el creador. No se borran datos ni se mezclan TEST y estable.

### 1.11.0 TEST
El creador intenta cargar automáticamente el catálogo de objetos desde el origen remoto la primera vez. Requiere internet; la biblioteca guardada se aprovecha sin nueva descarga. Las competencias especiales de subclases y dotes requieren revisión manual.


DM.AID TEST 1.11.0: Rasgos por nivel de Pícaro PHB 2014 y Asesino; acciones de armas equipadas en el stat block activo de iniciativa y hoja.


TEST 1.12.11: panel de rasgos base de las 12 clases y multiclase, con automatización parcial; las subclases restantes requieren ampliación.


### 1.12.11 TEST
- Secciones plegables, inventario abierto y editable, otras secciones bloqueadas por defecto.
- Velocidad racial automática, con rasgos de monje, bárbaro y dote Mobile; posibilidad de ajuste manual autorizado.

### Diseño compacto (1.12.11)
La densidad se aplica exclusivamente a las hojas de personaje desplegadas; se mantiene la navegación por tarjetas y la edición protegida.


1.17.3: Motor CA por fórmulas excluyentes, armadura natural racial, override DM y Forma salvaje manual controlada.


### 1.17.11
Al abrir la campaña se refrescan inmediatamente las tarjetas de combate y los statblocks sin iniciar un encuentro.
