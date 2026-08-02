<p align="right"><strong>English</strong> · <a href="README.md">Español</a></p>

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/242724234?v=4" width="84" height="84" alt="Alvaro Siles" style="border-radius:50%" />
</p>

<h1 align="center">🚀 Pro VSCode Keybindings</h1>
<p align="center">The shortcuts VS Code should ship with out of the box.</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=alvarosiles.pro-vscode-keybindings"><img alt="Marketplace" src="https://img.shields.io/badge/marketplace-Pro%20VSCode%20Keybindings-7c5cff" /></a>
  <a href="./privacity.en.md"><img alt="Privacy" src="https://img.shields.io/badge/privacy-zero%20telemetry-4fd1c5" /></a>
  <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-4fd1c5" />
</p>

<p align="center"><strong><a href="https://marketplace.visualstudio.com/items?itemName=alvarosiles.pro-vscode-keybindings">→ Install from the Marketplace</a></strong></p>

---

Pro VSCode Keybindings is a minimal set of keyboard shortcuts, plus a handful of smart commands for Git and running projects. No setup, no menus — install it and the missing keys are just there. Same combinations on Windows, Linux and macOS.

## Keybindings

| Key | Action |
| --- | --- |
| `Ctrl+1` | Comment / uncomment line |
| `Ctrl+A` | Select all |
| `Shift+Alt+↓` / `↑` | Duplicate line down / up |
| `Alt+↓` / `↑` | Move line down / up |
| `Ctrl+F1` | Open your global `settings.json` |
| `Ctrl+F2` | Open your global `keybindings.json` |
| `Ctrl+F3` | Toggle fold (collapse/expand code block) |
| `Ctrl+F4` | Join lines |
| `Ctrl+F5` | Run SQL *(only in `.sql` files, needs a DB client extension)* / Reload window *(otherwise)* |
| `Ctrl+F7` | Detect project type → prints it to a terminal |
| `Ctrl+F8` | Quick Commit → fills the commit message with `chore: update` |
| `Ctrl+F9` | Commit Message Picker → pick title + description, then **commits and pushes** |
| `Ctrl+F10` | Open the current folder in GitHub Desktop |
| `Ctrl+F12` | Stop debugging *(while debugging)* / Smart Run *(otherwise)* |
| `Ctrl+Shift+;` | New terminal |
| `Ctrl+Shift+C` | Open Claude sidebar |
| `Ctrl+Shift+C+V` | Open Claude sessions sidebar |

### File Explorer

| Key | Action |
| --- | --- |
| `Ctrl+R` | Open the selected file/folder as a new project window |
| `Ctrl+Shift+A` | 🚀 Open the folder currently selected in the Explorer in a new window |

"🚀 Open in VS Code" also shows up as an icon in the Explorer panel's title bar and in its context menu (right-click), with the `Ctrl+Shift+A` shortcut shown next to it.

**Smart Run (`Ctrl+F12`)** opens a picker to run the project the right way: Live Server for HTML, `npm run web` for React, Start Debugging for Java, `npm start` for React Native, `vsce package` for a VS Code extension.

**Commit Message Picker (`Ctrl+F9`)** opens a colored, numbered menu right in a terminal — pick a [Conventional Commits](https://www.conventionalcommits.org/) title (`feat`, `fix`, `docs`, etc.), then a matching description, and it commits and pushes immediately.

> ⚠️ `Ctrl+F9` pushes to the remote with no confirmation — double-check your branch before using it.

## Context menu (Editor and Explorer)

**♻️ Clean consoles** (`Ctrl+F6` inside a JS/TS/JSX/TSX file, or right-click → "♻️ Clean consoles" — available in both the editor and the Explorer) standardizes console usage in the file:

- Removes every temporary/debug `console.log(...)`.
- Guarantees a `console.error("Function: error.", err)` inside every `catch`.
- Adds `console.warn("Function: condition not met...")` before bare early-return guards and empty `if`/`else`/`switch` branches.
- Adds `console.info("Function: completed successfully.")` before the final return of `load*`, `init*`, `fetch*`, or `create*`-style functions.

Safe to run again: it first removes the lines it inserted on the previous run before re-instrumenting.

## Why people keep it installed

- **Zero friction** — no accounts, no setup, no learning curve. Install it and the keys are already there.
- **Lightweight** — no background processes, no editor slowdown.
- **Privacy first** — no telemetry, no analytics, no external servers. See the [privacy policy](privacity.en.md).

## Installation

Install from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=alvarosiles.pro-vscode-keybindings) — search for **Pro VSCode Keybindings**.

## Development

```bash
npm install
npm run build     # regenerates keybindings + bundles the extension
npm run watch     # rebuild extension.js on change
```

- **Add/change a shortcut** → edit the matching file under `src/*.json`, then `npm run build`. The build fails if two entries share a key.
- **Change smart-command logic** → edit `extension/extension.ts`, then `npm run build`.
- Try it out with `F5` (Extension Development Host), or `./scripts/test_local.sh` (Linux/macOS) / `./scripts/test_local.ps1` (Windows/PowerShell).

`src/*.json` are the source of truth — `scripts/build.js` merges them into `dist/keybindings.json` and `package.json`'s `contributes.keybindings`, since VS Code only reads keybindings from `package.json`.

## Publishing (maintainers)

```bash
npm install -g @vscode/vsce
vsce login alvarosiles   # one-time, needs an Azure DevOps PAT
```

```powershell
./scripts/publish.ps1 -Message "Add debug shortcuts"                    # build, bump version, commit, package
./scripts/publish.ps1 -Message "Add debug shortcuts" -Push -Publish     # also push + publish to the Marketplace
```

## About the developer

Created by **Alvaro Siles** — developer building productivity extensions and tools for browsers and Visual Studio Code. Pro VSCode Keybindings is an independent, open-source project, built and maintained by one person, in the open.

- GitHub: [@alvarosiles](https://github.com/alvarosiles)

---

<p align="center">
  © <a href="./LICENSE">MIT License</a> · <a href="https://github.com/alvarosiles/pro-vscode-keybindings/issues">Report an issue</a>
  <br />
  Made with ♥ by <a href="https://github.com/alvarosiles">Alvaro Siles</a>
</p>
