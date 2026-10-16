# Revisión funcional inicial DMAid

Correcciones de código que requieren validación de navegador:
- El nuevo creador ofrece ASI por progresión de cada clase (Guerrero y Pícaro tienen niveles excepcionales), con límite 20. **Dotes opcionales en lugar de ASI pendientes de integrar.**
- La ficha guarda asiChoicesV180 y puntajes finales calculados.
- El inventario inicial intenta enlazar objetos con el compendio y trae valores básicos de armadura para los nombres reconocidos; se agregó alias para armadura de cuero tachonado.
- Se restableció la sección DMG 2014 de equipo superior: oro adicional y objetos mágicos por abundancia de magia. El nombre de los objetos mágicos se registra, pero debe validarse contra biblioteca y no se asegura vinculación automática.
- Salvaciones: la clase inicial ya se utiliza en dmaSavingData1124. Debe verificarse con una prueba real y registrar clase elegida y resultado.
- Rasgos de clase: existen referencias de catálogo incompletas, algunas sin descripción ni verificación. No se inventaron fuentes. Pendiente auditoría por clase/subclase y bibliografía.

No se ha realizado prueba end-to-end de navegador: no declarar versión estable. Mantener en una rama de prueba y respaldar campañas.
