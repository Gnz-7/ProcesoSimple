# Gestor de Solicitudes — Demo de Playwright

Aplicación web sencilla de demostración educativa para automatización con Playwright.
Gestiona una única entidad (solicitudes) con inicio de sesión simulado, creación, edición y borrado completos, y persistencia local.

## Requisitos previos

- Node.js 18 o superior.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre la URL que indica Vite (normalmente <http://localhost:5173>).

## Credenciales de demostración

- Usuario: `alumno`
- Contraseña: `Playwright123`

No existe registro ni recuperación de contraseñas: es una sesión simulada en `sessionStorage`.

## Cómo restablecer los datos

En el listado, pulsa el botón **«Restablecer datos de prueba»** y confirma.
Se reemplazan las solicitudes actuales por los 5 datos de ejemplo iniciales (operación idempotente).

## Limitaciones de la persistencia

- Las solicitudes se guardan en `localStorage` bajo la clave `procesosimple.solicitudes`.
- Los datos son locales del navegador y del origen: no se sincronizan entre dispositivos ni navegadores.
- Si borras los datos de navegación, las solicitudes se pierden (el restablecimiento vuelve a dejar los datos de ejemplo).
- Si los datos almacenados se corrompen, la aplicación recupera automáticamente los datos de prueba.
- La sesión se guarda en `sessionStorage` y se pierde al cerrar la pestaña.

## Estructura del código

```
src/
  main.jsx          Entrada de la aplicación (enrutador)
  App.jsx           Rutas y protección de sesión
  constants.js      Opciones permitidas, credenciales, claves de almacenamiento
  session.js        Sesión simulada en sessionStorage
  storage.js        Persistencia centralizada en localStorage
  seedData.js       Datos iniciales deterministas
  validation.js     Validaciones reutilizables
  components/       Cabecera, formularios, diálogo, etiquetas
  pages/            Inicio de sesión, Listado, Crear, Detalle, Editar
  styles.css        Estilos
```

Los elementos interactivos incluyen atributos `data-testid` y nombres accesibles
estables para facilitar la automatización con Playwright.
