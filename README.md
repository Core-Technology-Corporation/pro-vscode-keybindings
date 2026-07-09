
https://marketplace.visualstudio.com/manage/publishers/alvarosiles

https://marketplace.visualstudio.com/items?itemName=alvarosiles.pro-vscode-snippets

https://github.com/kasecato/vscode-intellij-idea-keybindingsv

https://marketplace.visualstudio.com/items?itemName=servisoftssnippets.servisofts-snippetshttps://marketplace.visualstudio.com/items?itemName=servisoftssnippets.servisofts-snippets


 # 🚀 Pro VSCode Keybindings

Professional keyboard shortcuts for Visual Studio Code developers.

## Features

- ⚡ Faster workflow
- ⌨️ Productivity-focused shortcuts
- 🧑‍💻 Optimized for developers
- 🔥 Easy to use

## Keybindings

| Key     | Command                                | Action                  |
| ------- | --------------------------------------- | ------------------------ |
| `Ctrl+1`  | `editor.action.commentLine`             | Comment/uncomment line   |
| `Ctrl+2`  | `editor.action.copyLinesDownAction`     | Duplicate line down      |
| `Ctrl+3`  | `editor.action.deleteLines`             | Delete line              |
| `Ctrl+4`  | `workbench.action.terminal.toggleTerminal` | Toggle terminal        |
| `Ctrl+5`  | `editor.action.formatDocument`          | Format document          |
| `Ctrl+6`  | `workbench.action.files.saveAll`        | Save all files           |
| `F1`      | `workbench.action.openSettingsJson`     | Open settings.json       |

> Note: these bindings override VS Code's default `Ctrl+1..6` (focus editor group) and `F1` (command palette, still available via `Ctrl+Shift+P`).

## Installation

Install from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/vscode).

## Publishing (maintainers)

```bash
npm install -g @vscode/vsce
vsce login alvarosiles
vsce package
vsce publish
```

Requires a Personal Access Token from an Azure DevOps organization linked to the `alvarosiles` publisher. Add a 128x128 `icon.png` to the repo root and set `"icon": "icon.png"` in `package.json` before publishing (recommended but not required).

## License

MIT License