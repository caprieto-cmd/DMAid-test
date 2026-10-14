# DM.AID 1.5.2 · Gestor de campañas

Nueva pantalla de bienvenida con el emblema del d20 y selector de campañas. Permite crear, abrir, renombrar, duplicar, eliminar y respaldar todas las campañas.

## Datos

Cada campaña utiliza una clave de estado independiente `dmaid-state-<id>`. Al iniciar, se migra una copia del estado anterior `combat5e2014-v1` a **Mi primera campaña**, sin borrar el original. Las bibliotecas de monstruos y objetos se comparten entre campañas para evitar duplicar libros importados.

El respaldo general exporta las campañas y sus estados. Los catálogos compartidos de libros se exportan por separado desde sus respectivas secciones.

## Publicación

Sube todos los archivos a la raíz de GitHub Pages. Antes de actualizar, exporta tu partida desde la versión actual. La primera apertura debe mostrar el selector de campañas.

## Inicio y pantalla de carga
La transición disuelve la imagen inicial mientras aparece suavemente el menú de campañas; respeta Reducir movimiento de iPadOS. La imagen se precarga y la pantalla de bienvenida espera su carga (mínimo 2,3 segundos, máximo 6,5 segundos). Si falla, muestra el ícono local. El cambio entre campañas abre directamente la campaña seleccionada.
