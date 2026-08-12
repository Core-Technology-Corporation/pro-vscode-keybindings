# Change Log

## [1.0.10]

- Enhanced **⚡ Super** command with additional cleaning capabilities:
  - Collapse multi-line `style={{}}` to single line in JSX/React files.
  - Trim whitespace inside strings.
  - Clean objects and arrays (normalize spacing).
  - Normalize indentation across the file.
  - Add missing imports automatically.
- New command **🧹 Pro Keybindings: Clean Up Project Imports** — cleans and organizes imports across the entire project in one go.

## [1.0.9]

- New command **🧹 Pro Keybindings: Clean Up Project Imports** (`proKeybindings.cleanupProjectImports`), bound to accessible keybinding. Traverses all `.ts`, `.tsx`, `.js`, `.jsx` files in the project and runs the same import cleanup that "⚡ Super" applies — removes unused imports, reorders into external/internal/relative blocks, protects React imports.

## [1.0.8]

- New command **Pro Keybindings: Open Selected Folder In New Window** (`proKeybindings.openSelectedFolderInNewWindow`), bound to `Alt+Shift+Enter` in the File Explorer. Opens the folder currently selected in the Explorer in a new VS Code window, using the Explorer's own `copyFilePath` command internally to read the selection (the extension API doesn't expose it directly).

## [1.1.0]

- Added real extension logic (`extension/extension.ts`, bundled with esbuild into `dist/extension.js`) — this is no longer a pure keymap-only extension.
- New command **Pro Keybindings: Detect Project Type** (`proKeybindings.detectProjectType`), bound to `Ctrl+0` when the editor is not focused. Detects React, React Native, Next.js, Vue, Angular, Node/Express, Python, Go, Rust, Java (Maven/Gradle/plain), VS Code Extension, or static HTML/CSS/JS, and prints the result to a terminal.
- New command **Pro Keybindings: Smart Run** (`proKeybindings.smartRun`), bound to `Ctrl+8` when not already debugging. Opens a quick pick to: open the current page with Live Server (HTML), run `npm run web` (React), start debugging (Java), run `npm start` (React Native), or run `vsce package` (Extension).
- `Ctrl+8` while debugging still stops the session, and `Ctrl+0` with the editor focused still toggles a breakpoint — both original bindings are preserved.

## [1.0.0]

- Reorganized keybindings into per-category source files (`src/editor.json`, `terminal.json`, `explorer.json`, `git.json`, `debug.json`, `ai.json`, `navigation.json`) merged by `scripts/build.js`.
- Added 39 new shortcuts on top of the original 7: terminal management, explorer, git (commit/stage/push/pull/sync/branch), debug (start/stop/step/breakpoint/restart), AI inline suggestions & chat, and navigation (zen mode, split editor, panel, editor history).
- Added extension icon.

## [0.0.1]

- Initial release: comment/duplicate/delete line, toggle terminal, format document, save all, open settings.json.
