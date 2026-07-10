# 🚀 Pro VSCode Keybindings

Professional, productivity-focused keyboard shortcuts for Visual Studio Code — organized by workflow: editor, terminal, explorer, git, debug, AI and navigation.

## Features

- ⚡ 46 curated shortcuts covering the whole daily workflow
- 🧩 Organized into logical groups (editor, terminal, explorer, git, debug, AI, navigation)
- ⌨️ Consistent `Ctrl+Alt+<letter>` scheme so shortcuts are easy to remember
- 🤖 Includes shortcuts for inline suggestions / Copilot Chat (no-op if you don't have an AI extension installed)

> Note: some bindings intentionally override VS Code defaults (e.g. `Ctrl+1..0` normally focus editor group N). See the tables below for the full mapping.

## Keybindings

### Editor

| Key | Command | Action |
| --- | --- | --- |
| `Ctrl+1` | `editor.action.commentLine` | Comment / uncomment line |
| `Ctrl+2` | `editor.action.copyLinesDownAction` | Duplicate line down |
| `Ctrl+3` | `editor.action.deleteLines` | Delete line |
| `Ctrl+5` | `editor.action.formatDocument` | Format document |
| `Ctrl+6` | `workbench.action.files.saveAll` | Save all files |
| `Ctrl+Alt+J` | `editor.action.joinLines` | Join lines |
| `Ctrl+Alt+U` | `editor.action.transformToUppercase` | Transform selection to UPPERCASE |
| `Ctrl+Alt+Shift+U` | `editor.action.transformToLowercase` | Transform selection to lowercase |

### Terminal

| Key | Command | Action |
| --- | --- | --- |
| `Ctrl+4` | `workbench.action.terminal.toggleTerminal` | Toggle terminal |
| `Ctrl+Alt+T` | `workbench.action.terminal.new` | New terminal |
| `Ctrl+Alt+C` | `workbench.action.terminal.clear` | Clear terminal |
| `Ctrl+Alt+K` | `workbench.action.terminal.kill` | Kill terminal |
| `Ctrl+Alt+→` | `workbench.action.terminal.focusNext` | Focus next terminal |
| `Ctrl+Alt+←` | `workbench.action.terminal.focusPrevious` | Focus previous terminal |

### Explorer

| Key | Command | Action |
| --- | --- | --- |
| `Ctrl+Alt+E` | `workbench.view.explorer` | Focus Explorer |
| `Ctrl+Alt+B` | `workbench.action.toggleSidebarVisibility` | Toggle sidebar |
| `Ctrl+Alt+N` | `explorer.newFile` | New file |
| `Ctrl+Alt+Shift+N` | `explorer.newFolder` | New folder |
| `Ctrl+Alt+R` | `renameFile` | Rename file |
| `Ctrl+Alt+Shift+E` | `workbench.files.action.collapseExplorerFolders` | Collapse all folders |

### Git

| Key | Command | Action |
| --- | --- | --- |
| `Ctrl+Alt+G` | `workbench.view.scm` | Focus Source Control |
| `Ctrl+Alt+M` | `git.commit` | Commit |
| `Ctrl+Alt+S` | `git.stageAll` | Stage all changes |
| `Ctrl+Alt+Shift+S` | `git.unstageAll` | Unstage all changes |
| `Ctrl+Alt+P` | `git.push` | Push |
| `Ctrl+Alt+Shift+P` | `git.pull` | Pull |
| `Ctrl+Alt+Y` | `git.sync` | Sync |
| `Ctrl+Alt+Shift+B` | `git.createBranch` | Create branch |

### Debug

| Key | Command | Action |
| --- | --- | --- |
| `Ctrl+7` | `workbench.action.debug.start` | Start debugging |
| `Ctrl+8` | `workbench.action.debug.stop` | Stop debugging |
| `Ctrl+9` | `workbench.action.debug.stepOver` | Step over |
| `Ctrl+0` | `editor.debug.action.toggleBreakpoint` | Toggle breakpoint |
| `Ctrl+Alt+Shift+I` | `workbench.action.debug.stepInto` | Step into |
| `Ctrl+Alt+Shift+O` | `workbench.action.debug.stepOut` | Step out |
| `Ctrl+Alt+Shift+R` | `workbench.action.debug.restart` | Restart debugging |

### AI

| Key | Command | Action |
| --- | --- | --- |
| `Ctrl+Alt+I` | `editor.action.inlineSuggest.trigger` | Trigger inline suggestion |
| `Ctrl+Alt+]` | `editor.action.inlineSuggest.showNext` | Show next suggestion |
| `Ctrl+Alt+[` | `editor.action.inlineSuggest.showPrevious` | Show previous suggestion |
| `Ctrl+Alt+Enter` | `inlineChat.start` | Start inline chat |
| `Ctrl+Alt+Shift+Enter` | `workbench.action.chat.open` | Open chat |

> AI shortcuts rely on VS Code's built-in inline suggestion API and Chat feature. `inlineChat.start` / `workbench.action.chat.open` do nothing unless you have GitHub Copilot Chat (or another chat participant) installed.

### Navigation

| Key | Command | Action |
| --- | --- | --- |
| `F1` | `workbench.action.openSettingsJson` | Open settings.json |
| `Ctrl+Alt+Z` | `workbench.action.toggleZenMode` | Toggle Zen Mode |
| `Ctrl+Alt+\` | `workbench.action.splitEditor` | Split editor |
| `Ctrl+Alt+,` | `workbench.action.togglePanel` | Toggle bottom panel |
| `Ctrl+Alt+Shift+W` | `workbench.action.closeAllEditors` | Close all editors |
| `Ctrl+Alt+Shift+T` | `workbench.action.reopenClosedEditor` | Reopen closed editor |

## Installation

Install from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/vscode) — search for **Pro VSCode Keybindings**.

## Project structure

```
pro-vscode-keybindings/
│
├── package.json          # Extension manifest (contributes.keybindings is generated)
├── README.md
├── CHANGELOG.md
├── LICENSE
├── images/
│   └── icon.png
│
├── src/                   # Source of truth, one file per category
│   ├── editor.json
│   ├── terminal.json
│   ├── explorer.json
│   ├── git.json
│   ├── debug.json
│   ├── ai.json
│   └── navigation.json
│
├── scripts/
│   └── build.js           # Merges src/*.json, validates for key collisions,
│                           # writes dist/keybindings.json and updates package.json
│
└── dist/
    └── keybindings.json    # Generated, read-only reference build output
```

VS Code only reads keybindings from `contributes.keybindings` in `package.json` — it can't load an external file. `scripts/build.js` is the single source of truth pipeline: edit the category files under `src/`, then run the build so both `dist/keybindings.json` and `package.json` stay in sync.

## Development

```bash
npm run build   # merge src/*.json -> dist/keybindings.json + package.json
```

To add or change a shortcut, edit the matching file under `src/`, run `npm run build`, and reload the Extension Development Host (`F5`) to try it out. The build script fails fast if two entries claim the same key combination.

## Publishing (maintainers)

One-time setup:

```bash
npm install -g @vscode/vsce
vsce login alvarosiles
```

Requires a Personal Access Token from an Azure DevOps organization linked to the `alvarosiles` publisher.

Then, for each release, use `scripts/publish.ps1` — it builds, bumps the version, commits and packages a `.vsix`:

```powershell
./scripts/publish.ps1 -Message "Add debug shortcuts"
```

This does **not** push or publish by default. Add `-Push` to push the commit and/or `-Publish` to publish to the Marketplace once you're satisfied with the local `.vsix`:

```powershell
./scripts/publish.ps1 -Message "Add debug shortcuts" -Bump minor -Push -Publish
```

Or do it manually:

```bash
npm run build     # also runs automatically via vscode:prepublish
vsce package
vsce publish
```

## License

MIT License
