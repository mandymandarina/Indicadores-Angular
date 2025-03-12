# Indicadores-Angular
Muestra los indicadores financieros y los detalles de cada uno.

Este proyecto fue generado con Angular CLI versión 13.3.3.

# Servidor de desarrollo

Ejecuta ng serve para iniciar un servidor de desarrollo. Navega a http://localhost:4200/. La aplicación se recargará automáticamente si realizas cambios en los archivos fuente.

# Creación de código

Ejecuta ng generate component nombre-del-componente para generar un nuevo componente. También puedes usar ng generate directive|pipe|service|class|guard|interface|enum|module.

# Compilación

Ejecuta ng build para compilar el proyecto. Los archivos generados se almacenarán en el directorio dist/.

# Ejecución de pruebas unitarias

Ejecuta ng test para ejecutar las pruebas unitarias a través de Karma.

# Apis 

API para construcción de la aplicación:https://api.cmfchile.cl/index.html y https://mindicador.cl/api

# install

- npm install bootstrap

Se agregan en angular.json:

"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
],
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]

- ng add @angular/material
- npm install chart.js
- npm install ng2-charts
