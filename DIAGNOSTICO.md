# DMAid - diagnóstico de arranque

La aplicación no fue declarada funcional. Se añadió un mecanismo independiente que sustituye el splash por un diagnóstico si continúa después de 9 segundos. No modifica campañas ni borra almacenamiento.

## Prueba

Publica todos los archivos del ZIP juntos, en la raíz del sitio de pruebas. Abre con un parámetro nuevo, por ejemplo `?bootdiag=1`, para evitar una navegación cacheada. Espera 10 segundos. Si aparece el panel de diagnóstico, pulsa **Copiar diagnóstico** y envía el contenido. Si sigue apareciendo la pantalla de carga, probablemente no se entregó el `index.html` actualizado o el navegador está mostrando la versión instalada anterior.

En Chrome: F12 > Console para información adicional. No uses «Borrar datos del sitio» sin respaldar antes las campañas.

La prueba no puede certificarse desde este entorno: el navegador automatizado rechaza la navegación local por restricciones del entorno.
