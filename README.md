# 🚀 Pro VSCode Keybindings

Professional, productivity-focused keyboard shortcuts for Visual Studio Code — organized by workflow: editor, terminal, explorer, git, debug, AI and navigation.

## Features

- ⚡ 48 curated shortcuts covering the whole daily workflow
- 🧩 Organized into logical groups (editor, terminal, explorer, git, debug, AI, navigation)
- ⌨️ Consistent `Ctrl+Alt+<letter>` scheme so shortcuts are easy to remember
- 🤖 Includes shortcuts for inline suggestions / Copilot Chat (no-op if you don't have an AI extension installed)
- 🧠 **Smart commands**: `Ctrl+0` detects the current project's type, `Ctrl+9` opens a quick pick to run the right action for it (Live Server, `npm run web`, debug, `npm start`, `vsce package`)

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
| `Ctrl+8` | `workbench.action.debug.stop` | Stop debugging *(while debugging)* |
| `Ctrl+8` | `proKeybindings.smartRun` | Smart Run quick pick *(when not debugging)* — see below |
| `Ctrl+9` | `workbench.action.debug.stepOver` | Step over |
| `Ctrl+0` | `editor.debug.action.toggleBreakpoint` | Toggle breakpoint *(editor focused)* |
| `Ctrl+0` | `proKeybindings.detectProjectType` | Detect Project Type *(editor not focused)* — see below |
| `Ctrl+Alt+Shift+I` | `workbench.action.debug.stepInto` | Step into |
| `Ctrl+Alt+Shift+O` | `workbench.action.debug.stepOut` | Step out |
| `Ctrl+Alt+Shift+R` | `workbench.action.debug.restart` | Restart debugging |

### Smart commands

Two commands ship with real extension logic (not just static keybindings):

- **`proKeybindings.detectProjectType`** (`Ctrl+0` outside the editor) — inspects the open workspace folder (`package.json` dependencies, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`/`build.gradle`, loose `.java` files, `index.html`) and prints the detected type (React, React Native, Next.js, Vue, Angular, Node/Express, Python, Go, Rust, Java, VS Code Extension, or static HTML/CSS/JS) to a dedicated terminal.
- **`proKeybindings.smartRun`** (`Ctrl+8` while not debugging) — opens a quick pick with 5 options and runs the matching action:
  - **HTML** → `extension.liveServer.goOnline` (requires the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension)
  - **React** → `npm run web` in the terminal
  - **Java** → `workbench.action.debug.start`
  - **React Native** → `npm start` in the terminal
  - **Extension** → `npx vsce package` in the terminal

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
├── package.json          # Extension manifest (contributes.keybindings/.commands, main)
├── README.md
├── CHANGELOG.md
├── LICENSE
├── tsconfig.json
├── images/
│   └── icon.png
│
├── src/                   # Keybinding source of truth, one file per category
│   ├── editor.json
│   ├── terminal.json
│   ├── explorer.json
│   ├── git.json
│   ├── debug.json
│   ├── ai.json
│   └── navigation.json
│
├── extension/
│   └── extension.ts       # Extension host logic: proKeybindings.detectProjectType
│                           # and proKeybindings.smartRun
│
├── scripts/
│   └── build.js           # Merges src/*.json, validates for key collisions,
│                           # writes dist/keybindings.json and updates package.json
│
└── dist/                  # Generated (git-ignored build output)
    ├── keybindings.json    # Reference copy of contributes.keybindings
    └── extension.js        # esbuild bundle, this is what "main" points to
```

VS Code only reads keybindings from `contributes.keybindings` in `package.json` — it can't load an external file. `scripts/build.js` is the single source of truth pipeline for keybindings: edit the category files under `src/`, then run the build so both `dist/keybindings.json` and `package.json` stay in sync. Runtime behavior (the two smart commands) lives in `extension/extension.ts` and is bundled separately by esbuild into `dist/extension.js`, which is the only build artifact actually shipped in the `.vsix` (see `.vscodeignore`).

## Development

```bash
npm install
npm run build            # build:keybindings + build:extension
npm run watch             # rebuild extension.js on change while developing
```

To add or change a shortcut, edit the matching file under `src/`, run `npm run build`, and reload the Extension Development Host (`F5`) to try it out. The build script fails fast if two entries claim the same key combination.

To change the smart-command logic, edit `extension/extension.ts`, run `npm run build` (or `npm run watch`), then reload the Extension Development Host (`F5`).

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
