# 🚀 Pro VSCode Keybindings

*[🌐 English](README.md)*

Atajos de teclado mínimos para Visual Studio Code, más algunos comandos inteligentes para Git y para ejecutar proyectos. Las mismas teclas en Windows, Linux y macOS.

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
| `Ctrl+Shift+;` | Nueva terminal |
| `Ctrl+Shift+C` | Abrir el panel lateral de Claude |
| `Ctrl+Shift+C+V` | Abrir el panel lateral de sesiones de Claude |

### Explorador de archivos

| Tecla | Acción |
| --- | --- |
| `Ctrl+R` | Abrir el archivo/carpeta seleccionado como proyecto en una ventana nueva |
| `Alt+Shift+Enter` / `Ctrl+Shift+A` | Abrir la carpeta seleccionada en el Explorador en una ventana nueva |

**Smart Run (`Ctrl+F12`)** abre un selector para correr el proyecto de la forma correcta: Live Server para HTML, `npm run web` para React, Start Debugging para Java, `npm start` para React Native, `vsce package` para una extensión de VS Code.

**Commit Message Picker (`Ctrl+F9`)** abre un menú numerado y coloreado directamente en una terminal — elegís un título estilo [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, etc.), después una descripción a juego, y hace commit y push de inmediato.

> ⚠️ `Ctrl+F9` hace push al remoto sin pedir confirmación — revisá en qué rama estás antes de usarlo.

## Menú contextual del editor

**🧹 Formatear con consoles** — hacé click derecho dentro de un archivo JS/TS/JSX/TSX y agrega un `console.log` justo antes de cada `return` del archivo, para que puedas rastrear qué rama se ejecuta realmente en tiempo de ejecución. Se puede ejecutar de nuevo sin problema: las líneas ya instrumentadas se saltean.

## Instalación

Instalala desde el [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/vscode) — buscá **Pro VSCode Keybindings**.

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

## Licencia

Licencia MIT
