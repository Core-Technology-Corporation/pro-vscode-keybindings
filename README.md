# 🚀 Pro VSCode Keybindings

*[🌐 Español](README.es.md)*

Minimal keyboard shortcuts for Visual Studio Code, plus a few smart commands for Git and running projects. Same keys on Windows, Linux and macOS.

<p align="center">

 

</p>

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
| `Ctrl+F5` | Run SQL *(only in `.sql` files, needs a DB client extension)* |
| `Ctrl+F7` | Detect project type → prints it to a terminal |
| `Ctrl+F8` | Quick Commit → fills the commit message with `chore: update` |
| `Ctrl+F9` | Commit Message Picker → pick title + description, then **commits and pushes** |
| `Ctrl+F10` | Open the current folder in GitHub Desktop |
| `Ctrl+F12` | Stop debugging *(while debugging)* / Smart Run *(otherwise)* |

**Smart Run (`Ctrl+F12`)** opens a picker to run the project the right way: Live Server for HTML, `npm run web` for React, Start Debugging for Java, `npm start` for React Native, `vsce package` for a VS Code extension.

**Commit Message Picker (`Ctrl+F9`)** opens a colored, numbered menu right in a terminal — pick a [Conventional Commits](https://www.conventionalcommits.org/) title (`feat`, `fix`, `docs`, etc.), then a matching description, and it commits and pushes immediately.

> ⚠️ `Ctrl+F9` pushes to the remote with no confirmation — double-check your branch before using it.

## Editor context menu

**🧹 Format with consoles** — right-click inside a JS/TS/JSX/TSX file and it inserts a `console.log` right before every `return` statement in the file, so you can trace which branch actually executes at runtime. Safe to run again: lines already instrumented are skipped.

## Installation

Install from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/vscode) — search for **Pro VSCode Keybindings**.

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

## License

MIT License
