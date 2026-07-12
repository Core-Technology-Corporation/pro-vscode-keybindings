# 🚀 Pro VSCode Keybindings

Minimal, focused keyboard shortcuts for Visual Studio Code: comment/uncomment and a smart debug/run toggle.

## Features

- ⚡ 10 shortcuts, 11 bindings total — no clutter
- 🧠 **`F12` is context-aware**: stops the debugger while debugging, otherwise opens a quick pick to run the project (Live Server, `npm run web`, debug, `npm start`, `vsce package`)

> Note: `F10` overrides VS Code's default `workbench.action.debug.stepOver` (Step Over) while debugging, since this binding has no `when` restriction. `F5` requires a MySQL/database client extension that contributes `mysql.runSQLWithoutParse` (e.g. [Database Client](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2)) — it's a no-op otherwise, and only fires in `.sql`/SQL-language files, so it won't fight with VS Code's default "Start Debugging" outside those files. `F3` overrides VS Code's default `editor.action.nextMatchFindAction` (Find Next) while the editor is focused. `F2` overrides `editor.action.rename` (Rename Symbol) while the editor is focused. `F1` overrides the default Command Palette shortcut. `F12` overrides `editor.action.revealDefinition` (Go to Definition) while the editor is focused.

## Keybindings

| Key | Command | Action |
| --- | --- | --- |
| `Ctrl+1` | `editor.action.commentLine` | Comment / uncomment line |
| `F4` | `editor.action.joinLines` | Join lines |
| `F3` | `editor.toggleFold` | Toggle fold (collapse/expand code block) |
| `F5` | `mysql.runSQLWithoutParse` | Run SQL *(only in `.sql`/SQL-language files)* |
| `F10` | `proKeybindings.openGitHubDesktop` | Open the current workspace in GitHub Desktop — see below |
| `F8` | `proKeybindings.quickCommit` | Fill the Source Control commit box (Summary: `chore: update`, Description: `working`) — see below |
| `F12` | `workbench.action.debug.stop` | Stop debugging *(while debugging)* |
| `F12` | `proKeybindings.smartRun` | Smart Run quick pick *(when not debugging)* — see below |
| `F7` | `proKeybindings.detectProjectType` | Print the detected project type to a terminal — see below |
| `F2` | `workbench.action.openGlobalKeybindingsFile` | Open your global `keybindings.json` |
| `F1` | `workbench.action.openSettingsJson` | Open your global `settings.json` |

### Smart Run (`F12`, when not debugging)

Opens a quick pick with 5 options and runs the matching action:

- **HTML** → `extension.liveServer.goOnline` (requires the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension)
- **React** → `npm run web` in the terminal
- **Java** → `workbench.action.debug.start`
- **React Native** → `npm start` in the terminal
- **Extension** → `npx vsce package` in the terminal

### Detect Project Type (`F7`)

Inspects the open workspace folder (`package.json` dependencies, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`/`build.gradle`, loose `.java` files, `index.html`) and prints the detected type (React, React Native, Next.js, Vue, Angular, Node/Express, Python, Go, Rust, Java, VS Code Extension, or static HTML/CSS/JS) to a dedicated terminal.

### Open in GitHub Desktop (`F10`)

Runs `github "<workspace root>"` in a dedicated terminal, which opens the current folder in the [GitHub Desktop](https://desktop.github.com/) app (requires GitHub Desktop installed with its `github` shell command available on PATH — it's added automatically by the Windows/Mac installer). GitHub Desktop doesn't expose a remote-control API, so this only opens the app; you still press **Pull origin** yourself inside it.

### Quick Commit (`F8`)

Sets the Source Control commit message for the first open Git repository (`repository.inputBox.value`) to `chore: update` as the summary line (following [Conventional Commits](https://www.conventionalcommits.org/)) and `working` as the description, then focuses the Source Control view — so you only need to review and press **Commit**. Does nothing (with a warning) if the built-in Git extension isn't active or no repository is open.

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
