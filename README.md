# DMAid, versión depurada para pruebas (base 1.18.4)

Esta copia conserva los 11 recursos de ejecución de la aplicación original SIN alterar el código funcional. Se eliminan del paquete de despliegue documentos históricos, ensayos y dos módulos sin referencias directas (`races-mmotm.js`, `setup-libraries.js`). El ZIP original debe conservarse como respaldo.

## Cómo probar

1. Crear una rama `audit/clean-1.18.4` en el repositorio existente (o un repositorio temporal privado para un aislamiento completo).
2. Subir **todos los archivos de esta carpeta juntos a la raíz**, no solo `index.html`.
3. Activar GitHub Pages para esa rama, desde la raíz, si GitHub permite publicar desde ella. Si Pages publica únicamente desde `main` o `/docs` en tu configuración, usar un repositorio temporal para la prueba sin tocar producción.
4. Abrir la URL HTTPS proporcionada por Pages, idealmente en una ventana privada, para no reutilizar almacenamiento ni cachés anteriores.
5. Abrir las herramientas de desarrollo del navegador y observar la pestaña Network y Console. Confirmar que no hay 404 ni errores JavaScript.

La carga de bestiarios, conjuros y objetos utiliza GitHub raw externo y puede fallar con conexión ausente, bloqueo de red o cambios aguas arriba. El service worker almacena solo parte de los recursos; no equivale a disponibilidad offline de todos los compendios.

## Lista de pruebas manuales

- [ ] Carga inicial en navegador, branding, navegación y consola libre de errores.
- [ ] Crear campaña y personaje, guardar, recargar y revisar persistencia.
- [ ] Elegir raza/subraza; verificar características y elecciones pendientes.
- [ ] Crear personajes de distintas clases; validar elecciones de equipo inicial contra los objetos cargados.
- [ ] Crear personaje multiclase y confirmar reglas de competencias y equipo de primera clase.
- [ ] Importar catálogos de monstruos, conjuros y objetos y confirmar búsquedas y filtros.
- [ ] Crear y editar inventario, equipar ítems y recalcular CA cuando corresponda.
- [ ] Combate: iniciativa, PG, condiciones, conjuros y recargas.
- [ ] Recargar tras instalación PWA; revisar actualizaciones y apertura sin conexión de la interfaz básica.
- [ ] Exportar/importar datos en una campaña descartable y comparar resultados.

## Límites de validación

Verificación estática: referencias de ficheros, sintaxis de 95 bloques script HTML y los archivos JS individuales mediante Node; no prueba la ejecución real ni la completitud de reglas D&D. Se detectaron nombres de funciones repetidos en el archivo HTML; no se eliminaron porque podrían pertenecer a distintos ámbitos o sobrescribir una implementación anterior deliberadamente.
