# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Tests con Playwright

Este proyecto utiliza [**Playwright**](https://playwright.dev/) para la automatización de pruebas de extremo a extremo (E2E).

### Ejecutar todas las pruebas

```bash
npx playwright test
```

Ejecuta todas las pruebas definidas en la carpeta `tests/`.

* Por defecto, las pruebas se ejecutan en paralelo en **Chromium**, **Firefox** y **WebKit**.
* El reporte se generará en consola y, si está configurado, también en HTML.
  Para abrir el reporte en HTML después de la ejecución:

```bash
npx playwright show-report
```

### Grabar nuevas pruebas con el inspector

```bash
yarn playwright codegen
```

Abre el navegador en modo interactivo para **grabar acciones de usuario** y generar automáticamente el código de prueba.

Ejemplo:

```bash
yarn playwright codegen https://mi-sitio.com
```

Esto abrirá una ventana del navegador donde podrás interactuar con la web; el código equivalente se mostrará en la terminal.

---

### Comandos comunes

| Comando                              | Descripción                                                      |
| ------------------------------------ | ---------------------------------------------------------------- |
| `npx playwright test`                | Ejecuta todas las pruebas                                        |
| `npx playwright test nombre.spec.ts` | Ejecuta un archivo de prueba específico                          |
| `npx playwright test --grep "texto"` | Ejecuta pruebas que contengan cierto texto en su nombre          |
| `npx playwright test --ui`           | Abre la interfaz interactiva para seleccionar y ejecutar pruebas |
| `npx playwright show-report`         | Abre el reporte HTML de la última ejecución                      |
| `yarn playwright codegen <url>`      | Graba interacciones y genera código de prueba                    |
| `npx playwright install`             | Instala navegadores requeridos                                   |

---

💡 **Tip:** Para ejecutar solo una prueba específica dentro de un archivo, añade `.only`:

```ts
test.only('nombre de la prueba', async ({ page }) => {
  // ...
});
```
