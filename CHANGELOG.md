# Change Log

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
