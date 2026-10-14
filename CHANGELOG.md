## 1.6.0 TEST
- Instalador de bibliotecas en primer inicio: objetos, monstruos y razas.
- Importador JSON de razas con soporte de especies MMotM.
- Opción de raza importada en el asistente de personajes.
- Validación de aumentos de atributo +2/+1 o +1/+1/+1 para MMotM.
- Catálogos compartidos entre campañas del entorno TEST.

## 1.5.9 TEST
- Asegura alternativas completas para ballesta y virotes, arco y flechas (clérigo, pícaro, hechicero, brujo, guerrero).
- Añade auditoría automática de la estructura de equipo de las 12 clases del PHB.
- Sin cambios en almacenamiento de campañas.

## 1.5.9 TEST
- La selección condicional del martillo de guerra y cota de malla se convierte en objetos concretos antes de finalizar el asistente.
- El paso de equipamiento muestra el martillo de guerra como opción marcial permitida solo con competencia.
- Corregida la validación heredada que bloqueaba la creación por «si competente».

## 1.5.9 TEST
- Corregida la detección de competencias de armadura pesada mediante el campo real `sub` de la subclase. Forge/Forja permite cota de malla desde nivel 1.
- Se conservan las competencias raciales del enano con martillo de guerra.

## 1.5.9 TEST
- Arreglado bloqueo de arma sencilla a elección antes de pasar a revisión.
- Selecciones en desplegable vinculadas al inventario y confirmación visible.
- Comprobación de competencia en armas y condiciones de cota de malla y martillo de guerra.
- Caso enano de las montañas, clérigo de la Forja nivel 4.

## 1.5.3 TEST
- Selector de armas a elección con estadísticas básicas y enlace a biblioteca.
- Paquetes iniciales desplegables con componentes y consumo individual.
- Mantiene versiones anteriores del inventario.

## 1.5.2 · Transición animada de inicio
- Fundido suave entre arte de bienvenida y selector de campañas, con entrada desplazada discreta del menú.
- Compatible con Safari para iPad y la opción de accesibilidad Reducir movimiento.
- Sin cambios en datos, campañas, bibliotecas ni compras.

## 1.5.1 · Corrección de pantalla de bienvenida
- Precarga de imagen de portada, espera de carga y tiempo mínimo de visualización.
- Imagen de respaldo y tiempo máximo para evitar bloquear la aplicación.
- Nueva caché de PWA sin cambios en los datos de campañas.

## 1.5.0 · Gestión de campañas
- Pantalla de inicio con arte DM.AID d20.
- Menú inicial de campañas, creación y conmutación, nombres, copia, eliminación y respaldo general.
- Aislamiento de datos de campaña con migración no destructiva desde la versión antigua.
- Bibliotecas de libros compartidas.

## 1.4.0 (2026-10-14)
- Corrección de flujo del equipo inicial: definir elecciones variables antes de crear.
- Oro inicial por tiradas de clase (PHB 2014).
- Equipo para personajes nuevos de niveles superiores según DMG 2014 p.38 (magia baja, estándar y alta).
- Integración de recompensas iniciales en monedero e inventario.
- Esta versión no asigna automáticamente equipamiento del DMG a personajes ya existentes.

# Historial de versiones de DM.AID

## 1.3.1 · Mejora menor del creador de personajes
- Las tiradas 4d6 aparecen en listas desplegables para cada característica.
- Cada tirada se puede asignar una sola vez. Al elegir una ya utilizada, se intercambia con la asignación anterior.
- Resultados repetidos siguen siendo tiradas independientes, identificadas por número y dados.
- Se actualizó la versión de caché PWA sin cambiar la persistencia de personajes, tiendas ni inventarios.

## Convención de versiones: X.Y.Z
- **X:** versión estable principal.
- **Y:** característica importante o sistema actualizado.
- **Z:** mejora pequeña, corrección o ajuste de interfaz.

## 1.3.0 · 14 octubre 2026
- Personalización de bonificadores de origen según Tasha (TCE), conservando patrón racial.
- Selección de subraza del PHB 2014 en razas compatibles.
- Elecciones independientes de equipo inicial PHB 2014 por clase y equipo del trasfondo incorporados al inventario.
- Registro de monedas del trasfondo y preservación de datos existentes.

# Historial de versiones

## 1.2.0 (2026-10-14)
- Orden del asistente según PHB 2014.
- Trasfondos PHB 2014 con competencias y campos de elección.
- PG automáticos por dado de golpe de cada clase: media fija o tiradas.
- Datos de trasfondo y tiradas persistidos en la ficha.
- PWA con nueva versión de caché.

## 1.1.0
- Asistente de creación de personajes.

## 1.0.0
- Primera versión oficial de DM.AID.

## 1.5.9 TEST
- Validación de equipo inicial común a las clases PHB, raza, subraza y subclases reconocidas.
- Elección explícita de instrumentos, herramientas de artesano y juegos de azar en el paso de equipamiento.
- Control de elecciones sin resolver antes de avanzar.


## 1.5.9 TEST
- Los grupos de equipo inicial se asignan como objetos individuales, con cantidades propias y enlace a biblioteca por alias español/inglés.
- Municiones independientes (20 virotes o flechas), sin convertir el paquete de aventurero en artículos sueltos.
