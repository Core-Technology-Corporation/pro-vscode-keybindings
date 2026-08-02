<p align="right"><a href="README.en.md">English</a> · <strong>Español</strong></p>

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/242724234?v=4" width="84" height="84" alt="Alvaro Siles" style="border-radius:50%" />
</p>

<h1 align="center">🚀 Pro VSCode Keybindings</h1>
<p align="center">Los atajos que VS Code debería traer de fábrica.</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=alvarosiles.pro-vscode-keybindings"><img alt="Marketplace" src="https://img.shields.io/badge/marketplace-Pro%20VSCode%20Keybindings-7c5cff" /></a>
  <a href="./privacity.md"><img alt="Privacidad" src="https://img.shields.io/badge/privacidad-cero%20telemetr%C3%ADa-4fd1c5" /></a>
  <img alt="Licencia MIT" src="https://img.shields.io/badge/licencia-MIT-4fd1c5" />
</p>

<p align="center"><strong><a href="https://marketplace.visualstudio.com/items?itemName=alvarosiles.pro-vscode-keybindings">→ Instalar desde el Marketplace</a></strong></p>

---

Pro VSCode Keybindings es un set mínimo de atajos de teclado, más un puñado de comandos inteligentes para Git y para correr proyectos. Nada de configuración, nada de menús: instalás y ya tenés las teclas que faltaban. Las mismas combinaciones funcionan igual en Windows, Linux y macOS.

## Atajos de teclado

| Tecla | Acción |
| --- | --- |
| `Ctrl+1` | Comentar / descomentar línea |
| `Ctrl+A` | Seleccionar todo |
| `Shift+Alt+↓` / `↑` | Duplicar línea hacia abajo / arriba |
| `Alt+↓` / `↑` | Mover línea hacia abajo / arriba |
| `Ctrl+F1` | Abrir tu `settings.json` global |
| `Ctrl+F2` | Abrir tu `keybindings.json` global |
| `Ctrl+F3` | Plegar/desplegar bloque de código |
| `Ctrl+F4` | Unir líneas |
| `Ctrl+F5` | Ejecutar SQL *(solo en archivos `.sql`, requiere una extensión de cliente de base de datos)* / Recargar ventana *(en otro caso)* |
| `Ctrl+F7` | Detectar el tipo de proyecto → lo imprime en una terminal |
| `Ctrl+F8` | Quick Commit → completa el mensaje de commit con `chore: update` |
| `Ctrl+F9` | Commit Message Picker → elegís título + descripción, y **hace commit y push** |
| `Ctrl+F10` | Abrir la carpeta actual en GitHub Desktop |
| `Ctrl+F12` | Detener el debug *(mientras debuggeás)* / Smart Run *(en otro caso)* |
| `Ctrl+F6` | ♻️ Limpiar consolas *(solo en archivos de código)* |
| `F12` | ⚡ Super *(solo en archivos de código — reemplaza "Ir a la definición" en esos archivos)* |
| `Ctrl+Shift+;` | Nueva terminal |
| `Ctrl+Shift+C` | Abrir el panel lateral de Claude |
| `Ctrl+Shift+C+V` | Abrir el panel lateral de sesiones de Claude |

### Explorador de archivos

| Tecla | Acción |
| --- | --- |
| `Ctrl+R` | Abrir el archivo/carpeta seleccionado como proyecto en una ventana nueva |
| `Ctrl+Shift+A` | 🚀 Abrir la carpeta seleccionada en el Explorador en una ventana nueva |

"🚀 Abrir en VS Code" también aparece como ícono en la barra de título del panel Explorer y en su menú contextual (click derecho), con el atajo `Ctrl+Shift+A` visible al lado.

**Smart Run (`Ctrl+F12`)** abre un selector para correr el proyecto de la forma correcta: Live Server para HTML, `npm run web` para React, Start Debugging para Java, `npm start` para React Native, `vsce package` para una extensión de VS Code.

**Commit Message Picker (`Ctrl+F9`)** abre un menú numerado y coloreado directamente en una terminal — elegís un título estilo [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, etc.), después una descripción a juego, y hace commit y push de inmediato.

> ⚠️ `Ctrl+F9` hace push al remoto sin pedir confirmación — revisá en qué rama estás antes de usarlo.

## Menú contextual (Editor y Explorador)

**♻️ Limpiar consolas** (`Ctrl+F6`, o click derecho → "♻️ Limpiar consolas" — disponible tanto en el editor como en el Explorador, solo para `.ts` `.tsx` `.js` `.jsx` `.mjs` `.cjs` `.vue` `.svelte` `.astro`) estandariza el logging del archivo:

- Elimina todo `console.log(...)` temporal o de depuración.
- Asegura un `console.error("Función: error.", err)` dentro de cada `catch`.
- Agrega `console.warn("Función: condición no cumplida...")` antes de guardas (`return;` sin valor) y bloques `if`/`else`/`switch` vacíos.
- Agrega `console.info("Función: proceso finalizado correctamente.")` antes del `return` final en funciones tipo `load*`, `init*`, `fetch*` o `create*`.
- Quita espacios al final de línea y colapsa líneas en blanco consecutivas a una sola.
- Reformatea el archivo con el formateador del lenguaje (indentación, tabs vs. espacios, alineación de llaves) y organiza/limpia los imports no usados, usando los mismos comandos nativos de VS Code (`editor.action.formatDocument` / `editor.action.organizeImports`) — no reinventa un formatter propio.

No cambia la lógica del código. Se puede ejecutar de nuevo sin problema: antes de reinstrumentar, borra los mensajes que él mismo insertó en la corrida anterior.

> ℹ️ El formateo y la organización de imports dependen del formateador/lenguaje instalado para ese archivo (el de TypeScript/JavaScript viene con VS Code; para otros lenguajes necesitás la extensión correspondiente). La eliminación de variables o código muerto no se automatiza — cambiar eso a ciegas puede alterar el comportamiento.

**⚡ Super** (`F12`, o click derecho → "⚡ Super" — mismas extensiones que "Limpiar consolas") hace todo lo anterior y además:

- Elimina `console.debug(...)` y las líneas de `// console.log(...)` / `// console.debug(...)` comentadas.
- Agrega un caso `default:` con `console.warn(...)` + `break;` a los `switch` que no tienen uno.
- Reagrupa los `import` en tres bloques separados por una línea en blanco: externos, internos (`@/...`, `~/...`) y relativos (`./`, `../`), preservando el orden dentro de cada grupo.
- Protege textualmente la línea `import React, { Component } from 'react';`: si aparece exacta en el archivo, nunca se toca ni se mueve, ni siquiera cuando `organizeImports` o el formateador querrían tocarla.

> ⚠️ `F12` reemplaza el atajo por defecto de VS Code "Ir a la definición" (Go to Definition) — pero solo dentro de los archivos con esas extensiones. En el resto de los lenguajes, `F12` sigue funcionando como siempre.
>
> `⚡ Super` **no** elimina variables, parámetros o código muerto sin usar: eso requiere entender el código, no solo su forma, y automatizarlo con regex puede romper comportamiento en silencio. Para esa parte, usá el linter del proyecto (ESLint `--fix`, etc.).

## Por qué la gente la deja instalada

- **Cero fricción** — sin cuentas, sin configuración, sin curva de aprendizaje. Instalás y las teclas ya están.
- **Liviana** — no agrega procesos en segundo plano ni ralentiza el editor.
- **Privacidad primero** — sin telemetría, sin analytics, sin conexión a servidores externos. Ver [política de privacidad](privacity.md).

## Instalación

Instalala desde el [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=alvarosiles.pro-vscode-keybindings) — buscá **Pro VSCode Keybindings**.

## Desarrollo

```bash
npm install
npm run build     # regenera los keybindings + empaqueta la extensión
npm run watch     # recompila extension.js en cada cambio
```

- **Agregar/cambiar un atajo** → editá el archivo correspondiente en `src/*.json`, después `npm run build`. El build falla si dos entradas comparten la misma tecla.
- **Cambiar la lógica de los comandos inteligentes** → editá `extension/extension.ts`, después `npm run build`.
- Probalo con `F5` (Extension Development Host), o con `./scripts/test_local.sh` (Linux/macOS) / `./scripts/test_local.ps1` (Windows/PowerShell).

`src/*.json` son la fuente de verdad — `scripts/build.js` los combina en `dist/keybindings.json` y en `contributes.keybindings` de `package.json`, ya que VS Code solo lee keybindings desde `package.json`.

## Publicación (mantenedores)

```bash
npm install -g @vscode/vsce
vsce login alvarosiles   # una sola vez, requiere un PAT de Azure DevOps
```

```powershell
./scripts/publish.ps1 -Message "Add debug shortcuts"                    # build, sube versión, commit, empaqueta
./scripts/publish.ps1 -Message "Add debug shortcuts" -Push -Publish     # además hace push y publica en el Marketplace
```

## Sobre el desarrollador

Creada por **Alvaro Siles** — desarrollador de extensiones y herramientas de productividad para navegadores y Visual Studio Code. Pro VSCode Keybindings es un proyecto independiente y open-source, hecho y mantenido por una sola persona, a la vista de todos.

- GitHub: [@alvarosiles](https://github.com/alvarosiles)

---

<p align="center">
  © <a href="./LICENSE">Licencia MIT</a> · <a href="https://github.com/alvarosiles/pro-vscode-keybindings/issues">Reportar un problema</a>
  <br />
  Hecho con ♥ por <a href="https://github.com/alvarosiles">Alvaro Siles</a>
</p>
