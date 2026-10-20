# Gestor de Solicitudes

Aplicación web para gestionar solicitudes internas: crear, consultar, editar y eliminar registros,
con búsqueda por título y filtro por estado.

## Requisitos previos

- Node.js 18 o superior.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre la URL que indica Vite (normalmente <http://localhost:5173>).

## Credenciales de acceso

- Usuario: `alumno`
- Contraseña: `Playwright123`

No existe registro ni recuperación de contraseñas: la sesión se guarda en `sessionStorage`.

## Cómo restablecer los datos

En el listado, pulsa el botón **«Restablecer datos de prueba»** y confirma.
Se reemplazan las solicitudes actuales por las 5 solicitudes iniciales (operación idempotente).

## Limitaciones de la persistencia

- Las solicitudes se guardan en `localStorage` bajo la clave `procesosimple.solicitudes`.
- Los datos son locales del navegador y del origen: no se sincronizan entre dispositivos ni navegadores.
- Si borras los datos de navegación, las solicitudes se pierden (el restablecimiento vuelve a dejar las solicitudes iniciales).
- Si los datos almacenados se corrompen, la aplicación recupera automáticamente las solicitudes iniciales.
- La sesión se guarda en `sessionStorage` y se pierde al cerrar la pestaña.

## Estructura del código

```
src/
  main.jsx          Entrada de la aplicación (enrutador)
  App.jsx           Rutas y protección de sesión
  constants.js      Opciones permitidas, credenciales, claves de almacenamiento
  session.js        Sesión en sessionStorage
  storage.js        Persistencia centralizada en localStorage
  seedData.js       Solicitudes iniciales
  validation.js     Validaciones reutilizables
  components/       Cabecera, formularios, diálogo, etiquetas
  pages/            Inicio de sesión, Listado, Crear, Detalle, Editar
  styles.css        Estilos
```

Los elementos interactivos incluyen atributos `data-testid` y nombres accesibles
estables, con etiquetado HTML semántico.
