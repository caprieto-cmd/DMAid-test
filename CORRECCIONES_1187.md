# DMAid 1.18.7: botones de conjuros

Causa identificada: las etiquetas `onclick` del editor de magia tenían cadenas generadas por JSON.stringify con comillas dobles sin escapar dentro de atributos HTML entre comillas dobles. El navegador truncaba los atributos, por lo que los botones Añadir, Quitar y Concentrar no ejecutaban correctamente sus funciones.

Se introdujo `safeArg()` que HTML-escapa las cadenas JSON al incrustarlas en los atributos. Esto conserva los nombres de conjuros con comillas, apostrofes u otros caracteres.

También se actualizó versión visible y rutas de caché a 1.18.7.

Prueba manual: en Hojas de personajes, abrir Thalion, buscar Guidance, Añadir, verificar que la fila aparece en Trucos conocidos, cerrar/reabrir ficha y comprobar persistencia, Quitar y volver a añadir.

Advertencia: pendiente de prueba funcional en navegador real. Mantener respaldo 1.18.6.
