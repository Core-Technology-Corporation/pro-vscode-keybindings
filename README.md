# 🚀 Pro VSCode Keybindings

*[🇪🇸 Español](README.es.md)*

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
| `F1` | Open your global `settings.json` |
| `F2` | Open your global `keybindings.json` |
| `F3` | Toggle fold (collapse/expand code block) |
| `F4` | Join lines |
| `F5` | Run SQL *(only in `.sql` files, needs a DB client extension)* |
| `F7` | Detect project type → prints it to a terminal |
| `F8` | Quick Commit → fills the commit message with `chore: update` |
| `F9` | Commit Message Picker → pick title + description, then **commits and pushes** |
| `F10` | Open the current folder in GitHub Desktop |
| `F12` | Stop debugging *(while debugging)* / Smart Run *(otherwise)* |

**Smart Run (`F12`)** opens a picker to run the project the right way: Live Server for HTML, `npm run web` for React, Start Debugging for Java, `npm start` for React Native, `vsce package` for a VS Code extension.

**Commit Message Picker (`F9`)** opens a colored, numbered menu right in a terminal — pick a [Conventional Commits](https://www.conventionalcommits.org/) title (`feat`, `fix`, `docs`, etc.), then a matching description, and it commits and pushes immediately.

> ⚠️ `F9` pushes to the remote with no confirmation — double-check your branch before using it.

Overrides worth knowing: `F1` replaces the Command Palette shortcut, `F2` replaces Rename Symbol, `F3` replaces Find Next, `F10` replaces Step Over (while debugging), `F12` replaces Go to Definition.

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
- Try it out with `F5` (Extension Development Host) or `./scripts/test_local.ps1`.

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
