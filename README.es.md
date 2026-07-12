# 🚀 Pro VSCode Keybindings

*[🇺🇸 English](README.md)*

Atajos de teclado mínimos para Visual Studio Code, más algunos comandos inteligentes para Git y para ejecutar proyectos. Las mismas teclas en Windows, Linux y macOS.

## Atajos de teclado

| Tecla | Acción |
| --- | --- |
| `Ctrl+1` | Comentar / descomentar línea |
| `Ctrl+A` | Seleccionar todo |
| `Shift+Alt+↓` / `↑` | Duplicar línea hacia abajo / arriba |
| `Alt+↓` / `↑` | Mover línea hacia abajo / arriba |
| `F1` | Abrir tu `settings.json` global |
| `F2` | Abrir tu `keybindings.json` global |
| `F3` | Plegar/desplegar bloque de código |
| `F4` | Unir líneas |
| `F5` | Ejecutar SQL *(solo en archivos `.sql`, requiere una extensión de cliente de base de datos)* |
| `F7` | Detectar el tipo de proyecto → lo imprime en una terminal |
| `F8` | Quick Commit → completa el mensaje de commit con `chore: update` |
| `F9` | Commit Message Picker → elegís título + descripción, y **hace commit y push** |
| `F10` | Abrir la carpeta actual en GitHub Desktop |
| `F12` | Detener el debug *(mientras debuggeás)* / Smart Run *(en otro caso)* |

**Smart Run (`F12`)** abre un selector para correr el proyecto de la forma correcta: Live Server para HTML, `npm run web` para React, Start Debugging para Java, `npm start` para React Native, `vsce package` para una extensión de VS Code.

**Commit Message Picker (`F9`)** abre un menú numerado y coloreado directamente en una terminal — elegís un título estilo [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, etc.), después una descripción a juego, y hace commit y push de inmediato.

> ⚠️ `F9` hace push al remoto sin pedir confirmación — revisá en qué rama estás antes de usarlo.

Atajos que reemplazan comportamiento nativo de VS Code: `F1` reemplaza la Command Palette, `F2` reemplaza Rename Symbol, `F3` reemplaza Find Next, `F10` reemplaza Step Over (mientras debuggeás), `F12` reemplaza Go to Definition.

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
- Probalo con `F5` (Extension Development Host) o con `./scripts/test_local.ps1`.

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
