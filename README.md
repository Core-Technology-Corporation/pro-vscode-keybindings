# 🚀 Pro VSCode Keybindings

Minimal, focused keyboard shortcuts for Visual Studio Code: comment/uncomment and a smart debug/run toggle.

## Features

- ⚡ 11 shortcuts, 12 bindings total — no clutter
- 🧠 **`F12` is context-aware**: stops the debugger while debugging, otherwise opens a quick pick to run the project (Live Server, `npm run web`, debug, `npm start`, `vsce package`)

> Note: `F1` overrides the default Command Palette shortcut. `F2` overrides `editor.action.rename` (Rename Symbol) while the editor is focused. `F3` overrides VS Code's default `editor.action.nextMatchFindAction` (Find Next) while the editor is focused. `F5` requires a MySQL/database client extension that contributes `mysql.runSQLWithoutParse` (e.g. [Database Client](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2)) — it's a no-op otherwise, and only fires in `.sql`/SQL-language files, so it won't fight with VS Code's default "Start Debugging" outside those files. `F10` overrides VS Code's default `workbench.action.debug.stepOver` (Step Over) while debugging, since this binding has no `when` restriction. `F12` overrides `editor.action.revealDefinition` (Go to Definition) while the editor is focused.

## Keybindings

| Key | Command | Action |
| --- | --- | --- |
| `Ctrl+1` | `editor.action.commentLine` | Comment / uncomment line |
| `F1` | `workbench.action.openSettingsJson` | Open your global `settings.json` |
| `F2` | `workbench.action.openGlobalKeybindingsFile` | Open your global `keybindings.json` |
| `F3` | `editor.toggleFold` | Toggle fold (collapse/expand code block) |
| `F4` | `editor.action.joinLines` | Join lines |
| `F5` | `mysql.runSQLWithoutParse` | Run SQL *(only in `.sql`/SQL-language files)* |
| `F7` | `proKeybindings.detectProjectType` | Print the detected project type to a terminal — see below |
| `F8` | `proKeybindings.quickCommit` | Fill the Source Control commit box (Summary: `chore: update`, Description: `working`) — see below |
| `F9` | `proKeybindings.commitMessagePicker` | Pick a commit title, then a matching description, then commit **and push** immediately — see below |
| `F10` | `proKeybindings.openGitHubDesktop` | Open the current workspace in GitHub Desktop — see below |
| `F12` | `workbench.action.debug.stop` | Stop debugging *(while debugging)* |
| `F12` | `proKeybindings.smartRun` | Smart Run quick pick *(when not debugging)* — see below |

### Detect Project Type (`F7`)

Inspects the open workspace folder (`package.json` dependencies, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`/`build.gradle`, loose `.java` files, `index.html`) and prints the detected type (React, React Native, Next.js, Vue, Angular, Node/Express, Python, Go, Rust, Java, VS Code Extension, or static HTML/CSS/JS) to a dedicated terminal.

### Quick Commit (`F8`)

Sets the Source Control commit message for the first open Git repository (`repository.inputBox.value`) to `chore: update` as the summary line (following [Conventional Commits](https://www.conventionalcommits.org/)) and `working` as the description, then focuses the Source Control view — so you only need to review and press **Commit**. Does nothing (with a warning) if the built-in Git extension isn't active or no repository is open.

### Commit Message Picker (`F9`)

Opens a dedicated terminal (built on VS Code's `Pseudoterminal` API, not a shell) with a numbered menu of 9 curated commit titles ([Conventional Commits](https://www.conventionalcommits.org/) style: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `perf`, `chore`), each colored by type. Type a number and press Enter to pick a title; a second colored menu then shows matching descriptions for that same type (8 for `feat`, 8 for `fix`, 7 for `docs`, 7 for `refactor`, 5 for `test`, 7 for `chore`, 6 for `perf` — `style` has no second menu, so picking it fills only the title). Picking the description **commits AND pushes immediately** — no manual steps: it fills the Source Control commit box with title + description, calls `repository.commit()` (staged changes, or all changes if nothing was staged), then `repository.push()`. If the commit fails (e.g. nothing to commit), the message stays in the commit box for a manual commit. If only the push fails (e.g. no network, diverged branch), the commit still happened — push manually from Source Control.

> ⚠️ This pushes to the remote with no extra confirmation prompt. Make sure you're on the right branch before using `F9`.

### Open in GitHub Desktop (`F10`)

Runs `github "<workspace root>"` in a dedicated terminal, which opens the current folder in the [GitHub Desktop](https://desktop.github.com/) app (requires GitHub Desktop installed with its `github` shell command available on PATH — it's added automatically by the Windows/Mac installer). GitHub Desktop doesn't expose a remote-control API, so this only opens the app; you still press **Pull origin** yourself inside it.

### Smart Run (`F12`, when not debugging)

Opens a quick pick with 5 options and runs the matching action:

- **HTML** → `extension.liveServer.goOnline` (requires the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension)
- **React** → `npm run web` in the terminal
- **Java** → `workbench.action.debug.start`
- **React Native** → `npm start` in the terminal
- **Extension** → `npx vsce package` in the terminal

| Windows / Linux | macOS      | Acción                                | Soportado |
| --------------- | ---------- | -------------------------------------- | --------- |
| `Ctrl + 1`      | `Ctrl + 1` | Comment / uncomment line               | ✅ Sí      |
| `F1`            | `F1`       | Open global `settings.json`            | ✅ Sí      |
| `F2`            | `F2`       | Open global `keybindings.json`         | ✅ Sí      |
| `F3`            | `F3`       | Toggle fold                            | ✅ Sí      |
| `F4`            | `F4`       | Join lines                             | ✅ Sí      |
| `F5`            | `F5`       | Run SQL *(only in `.sql` files)*       | ✅ Sí      |
| `F7`            | `F7`       | Detect project type                    | ✅ Sí      |
| `F8`            | `F8`       | Quick Commit                           | ✅ Sí      |
| `F9`            | `F9`       | Commit Message Picker (commit + push)  | ✅ Sí      |
| `F10`           | `F10`      | Open in GitHub Desktop                 | ✅ Sí      |
| `F12`           | `F12`      | Stop debugging / Smart Run             | ✅ Sí      |

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
