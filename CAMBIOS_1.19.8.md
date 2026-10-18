# DMAid 1.19.8: estabilización del desplazamiento

- Reserva permanente del espacio de barra vertical dentro de la ventana de Hoja de personaje (`overflow-y: scroll; scrollbar-gutter: stable`).
- Eliminada la restauración tardía de scroll en `requestAnimationFrame` al modificar inventario, que provocaba un segundo movimiento visible.
- Eliminada restauración tardía equivalente del scroll de la página en el control de inventario.
- Se mantiene la restauración inmediata de posición y desplegables, sin tocar reglas, magia o recursos.

Verificado: sintaxis de scripts inline (`node --check`), integridad de ZIP. Pendiente: prueba manual de interfaz en Opera GX.
