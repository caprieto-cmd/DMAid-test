# DMAid 1.19.0 · Rasgos de Druida por nivel

Base: 1.18.9, conservando catálogo de conjuros y asignaciones existentes.

- Rasgos de Druida PHB 2014, filtrados por nivel de Druida.
- Forma Salvaje: usos, duración, restricciones por nivel, CR normal y estado de conjuración.
- Círculo de la Luna: Combat Wild Shape (Bonus Action y curación con espacio), Circle Forms (CR dinámico y límites de movimiento), Primal Strike (6), Elemental Wild Shape (10), Thousand Forms (14).
- Círculos adicionales indexados: Tierra (PHB), Sueños y Pastor (XGE), Esporas (GGTR), Estrellas y Fuego Salvaje (TCE); descripciones orientativas por nivel.
- Los rasgos y niveles se muestran en ficha y vista táctica usando el renderer existente. No se cobran espacios ni usos al consultar; **la activación y sincronización de los recursos no se ha implementado en esta iteración**.
- Los círculos más allá del PHB mantienen textos resumidos que requieren contraste editorial con sus manuales. **No considerar los siete círculos verificados exhaustivamente**.

## Prueba Thalion (Wood Elf, Druida Luna 3)
Deben aparecer Druídico, Lanzamiento de conjuros, Forma Salvaje, Combat Wild Shape y Circle Forms. El CR máximo es 1, sin nado ni vuelo. Duración 1 hora, dos usos por descanso corto o largo. Debe describirse curación con Bonus Action gastando un espacio de conjuro (1d8/nivel). Comprobar que los conjuros y slots guardados no cambian al abrir el panel.

## Notas técnicas
Se añade `dma-druid-features-1190.js` al final de la carga; se apoya en el motor de rasgos de clase sin modificar la persistencia existente. La versión visible se actualiza a 1.19.0.
