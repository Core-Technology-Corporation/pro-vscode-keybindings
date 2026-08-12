"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// extension/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate,
  detectProjectType: () => detectProjectType
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var sharedTerminal;
function getTerminal() {
  if (!sharedTerminal || sharedTerminal.exitStatus !== void 0) {
    sharedTerminal = vscode.window.createTerminal("Pro Keybindings");
  }
  sharedTerminal.show();
  return sharedTerminal;
}
function runInTerminal(command) {
  getTerminal().sendText(command, true);
}
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return void 0;
  }
}
function hasJavaFile(dir, depth = 0) {
  if (depth > 4) {
    return false;
  }
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (hasJavaFile(full, depth + 1)) {
        return true;
      }
    } else if (entry.name.endsWith(".java")) {
      return true;
    }
  }
  return false;
}
function detectProjectType(root) {
  const pkgPath = path.join(root, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = readJson(pkgPath) ?? {};
    if (pkg.engines?.vscode) {
      return "VS Code Extension";
    }
    const deps = { ...pkg.dependencies ?? {}, ...pkg.devDependencies ?? {} };
    if ("next" in deps) return "Next.js";
    if ("react-native" in deps) return "React Native";
    if ("react" in deps) return "React";
    if ("vue" in deps) return "Vue";
    if ("@angular/core" in deps) return "Angular";
    if ("express" in deps) return "Node.js / Express";
    return "Node.js";
  }
  if (fs.existsSync(path.join(root, "pyproject.toml"))) return "Python (pyproject.toml)";
  if (fs.existsSync(path.join(root, "requirements.txt"))) return "Python (requirements.txt)";
  if (fs.existsSync(path.join(root, "go.mod"))) return "Go";
  if (fs.existsSync(path.join(root, "Cargo.toml"))) return "Rust";
  if (fs.existsSync(path.join(root, "pom.xml"))) return "Java (Maven)";
  if (fs.existsSync(path.join(root, "build.gradle"))) return "Java / Kotlin (Gradle)";
  if (hasJavaFile(root)) return "Java (sin Maven/Gradle)";
  if (fs.existsSync(path.join(root, "index.html"))) return "HTML/CSS/JS estatico";
  return "No detectado";
}
function getWorkspaceRoot() {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}
async function cmdDetectProjectType() {
  const root = getWorkspaceRoot();
  if (!root) {
    vscode.window.showWarningMessage("Pro Keybindings: no hay ninguna carpeta abierta.");
    return;
  }
  const tipo = detectProjectType(root);
  runInTerminal(`echo "Tipo de proyecto: ${tipo}"`);
}
async function cmdSmartRun() {
  const options = [
    {
      label: "HTML",
      description: "Abrir con Live Server",
      run: async () => {
        if (!vscode.extensions.getExtension("ritwickdey.LiveServer")) {
          vscode.window.showWarningMessage(
            'Instala la extensi\xF3n "Live Server" (ritwickdey.LiveServer) para usar esta opci\xF3n.'
          );
          return;
        }
        await vscode.commands.executeCommand("extension.liveServer.goOnline");
      }
    },
    {
      label: "React",
      description: "npm run web",
      run: () => runInTerminal("npm run web")
    },
    {
      label: "Java",
      description: "Depurar (Start Debugging)",
      run: () => vscode.commands.executeCommand("workbench.action.debug.start")
    },
    {
      label: "React Native",
      description: "npm start",
      run: () => runInTerminal("npm start")
    },
    {
      label: "Extension",
      description: "vsce package",
      run: () => runInTerminal("npx vsce package")
    }
  ];
  const pick = await vscode.window.showQuickPick(options, {
    placeHolder: "\xBFQu\xE9 quieres ejecutar?"
  });
  await pick?.run();
}
async function cmdOpenGitHubDesktop() {
  const root = getWorkspaceRoot();
  if (!root) {
    vscode.window.showWarningMessage("Pro Keybindings: no hay ninguna carpeta abierta.");
    return;
  }
  runInTerminal(`github "${root}"`);
}
async function getFirstRepo() {
  const gitExtension = vscode.extensions.getExtension("vscode.git");
  if (!gitExtension) {
    vscode.window.showWarningMessage("Pro Keybindings: la extensi\xF3n de Git de VS Code no est\xE1 disponible.");
    return void 0;
  }
  const git = gitExtension.isActive ? gitExtension.exports : await gitExtension.activate();
  const api = git.getAPI(1);
  const repo = api.repositories[0];
  if (!repo) {
    vscode.window.showWarningMessage("Pro Keybindings: no se encontr\xF3 ning\xFAn repositorio Git abierto.");
    return void 0;
  }
  return repo;
}
async function cmdQuickCommit() {
  const repo = await getFirstRepo();
  if (!repo) {
    return;
  }
  repo.inputBox.value = "chore: update\n\nworking";
  await vscode.commands.executeCommand("workbench.view.scm");
}
var commitTitles = [
  "feat: agrega autenticaci\xF3n con JWT",
  "feat: implementa recuperaci\xF3n de contrase\xF1a",
  "fix: corrige validaci\xF3n del formulario",
  "refactor: separa l\xF3gica del controlador",
  "style: organiza importaciones",
  "docs: actualiza README",
  "test: agrega pruebas del servicio de usuarios",
  "perf: optimiza consulta de productos",
  "chore: actualiza dependencias"
];
var commitDescriptionsByType = {
  feat: [
    "feat: Se agregan las columnas solicitadas",
    "feat: Se implementa el carrito de compras",
    "feat: Se crean roles y permisos para el m\xF3dulo de ventas",
    "feat: Se incorpora el tema oscuro",
    "feat: Se agrega la opci\xF3n de exportar a Excel",
    "feat: Se implementan filtros de b\xFAsqueda",
    "feat: Se agrega paginaci\xF3n al listado de usuarios",
    "feat: Se crea el m\xF3dulo de reportes"
  ],
  fix: [
    "fix: Se corrige el error al iniciar sesi\xF3n",
    "fix: Se soluciona el problema al anular registros",
    "fix: Se corrige la validaci\xF3n del formulario",
    "fix: Se repara la navegaci\xF3n entre p\xE1ginas",
    "fix: Se corrige el c\xE1lculo de totales",
    "fix: Se soluciona el error en la carga de im\xE1genes",
    "fix: Se evita la creaci\xF3n de registros duplicados",
    "fix: Se corrige la actualizaci\xF3n de datos"
  ],
  docs: [
    "docs: Se actualiza el README",
    "docs: Se agrega la gu\xEDa de instalaci\xF3n",
    "docs: Se documenta la API",
    "docs: Se corrigen errores ortogr\xE1ficos",
    "docs: Se agregan ejemplos de uso",
    "docs: Se actualiza la documentaci\xF3n del proyecto",
    "docs: Se documentan las nuevas funcionalidades"
  ],
  refactor: [
    "refactor: Se reorganiza la estructura del proyecto",
    "refactor: Se simplifica la l\xF3gica de autenticaci\xF3n",
    "refactor: Se separa la l\xF3gica del controlador",
    "refactor: Se elimina c\xF3digo duplicado",
    "refactor: Se extraen funciones reutilizables",
    "refactor: Se mejora la organizaci\xF3n de componentes",
    "refactor: Se renombran m\xE9todos para mayor claridad"
  ],
  test: [
    "test: Se agregan pruebas para el m\xF3dulo de ventas",
    "test: Se actualizan las pruebas de autenticaci\xF3n",
    "test: Se corrigen las pruebas unitarias",
    "test: Se agregan pruebas de integraci\xF3n",
    "test: Se aumenta la cobertura de pruebas"
  ],
  chore: [
    "chore: Se actualizan las dependencias",
    "chore: Se configura ESLint",
    "chore: Se agrega el script de despliegue",
    "chore: Se actualiza la configuraci\xF3n de Git",
    "chore: Se eliminan archivos temporales",
    "chore: Se reorganiza la configuraci\xF3n del proyecto",
    "chore: Se actualizan las variables de entorno"
  ],
  perf: [
    "perf: Se optimiza la consulta a la base de datos",
    "perf: Se reduce el tiempo de carga",
    "perf: Se optimiza el consumo de memoria",
    "perf: Se mejora el rendimiento de las consultas",
    "perf: Se optimiza la carga de im\xE1genes",
    "perf: Se reducen las peticiones al servidor"
  ]
};
var ANSI_RESET = "\x1B[0m";
var ANSI_BOLD = "\x1B[1m";
var ANSI_DIM = "\x1B[2m";
var typeColors = {
  feat: "\x1B[32m",
  // green
  fix: "\x1B[31m",
  // red
  refactor: "\x1B[36m",
  // cyan
  style: "\x1B[35m",
  // magenta
  docs: "\x1B[34m",
  // blue
  test: "\x1B[33m",
  // yellow
  perf: "\x1B[92m",
  // bright green
  chore: "\x1B[90m"
  // gray
};
function colorFor(text) {
  const type = text.split(":")[0].trim();
  return typeColors[type] ?? "";
}
var CommitMenuPty = class {
  constructor(repo) {
    this.repo = repo;
  }
  repo;
  writeEmitter = new vscode.EventEmitter();
  onDidWrite = this.writeEmitter.event;
  closeEmitter = new vscode.EventEmitter();
  onDidClose = this.closeEmitter.event;
  stage = "title";
  selectedTitle = "";
  buffer = "";
  open() {
    this.printTitleMenu();
  }
  close() {
  }
  handleInput(data) {
    if (data === "\r") {
      this.writeEmitter.fire("\r\n");
      this.onEnter();
      return;
    }
    if (data === "\x7F") {
      if (this.buffer.length > 0) {
        this.buffer = this.buffer.slice(0, -1);
        this.writeEmitter.fire("\b \b");
      }
      return;
    }
    if (/^[0-9]$/.test(data)) {
      this.buffer += data;
      this.writeEmitter.fire(data);
    }
  }
  printTitleMenu() {
    this.writeEmitter.fire(`\r
${ANSI_BOLD}PASO 1 de 2 \u2014 \xBFQu\xE9 tipo de cambio hiciste?${ANSI_RESET}\r
`);
    this.writeEmitter.fire(`${ANSI_DIM}Esto va a ser el t\xEDtulo del commit (lo que ver\xE1 tu jefe/equipo en el historial de Git).${ANSI_RESET}\r
\r
`);
    commitTitles.forEach((title, i) => {
      this.writeEmitter.fire(`${colorFor(title)}  ${i + 1}) ${title}${ANSI_RESET}\r
`);
    });
    this.writeEmitter.fire(`\r
${ANSI_DIM}Escrib\xED el n\xFAmero de la opci\xF3n y presion\xE1 Enter:${ANSI_RESET} `);
  }
  printDescriptionMenu(descriptions) {
    this.writeEmitter.fire(`\r
${ANSI_BOLD}PASO 2 de 2 \u2014 Cont\xE1 con m\xE1s detalle qu\xE9 hiciste${ANSI_RESET}\r
`);
    this.writeEmitter.fire(`${ANSI_DIM}Esto va a ser la descripci\xF3n del commit, debajo del t\xEDtulo.${ANSI_RESET}\r
\r
`);
    descriptions.forEach((desc, i) => {
      this.writeEmitter.fire(`${colorFor(desc)}  ${i + 1}) ${desc}${ANSI_RESET}\r
`);
    });
    this.writeEmitter.fire(`\r
${ANSI_DIM}Escrib\xED el n\xFAmero de la opci\xF3n y presion\xE1 Enter:${ANSI_RESET} `);
  }
  onEnter() {
    const n = parseInt(this.buffer, 10);
    this.buffer = "";
    if (this.stage === "title") {
      if (!(n >= 1 && n <= commitTitles.length)) {
        this.writeEmitter.fire(`${ANSI_DIM}Ese n\xFAmero no existe, prob\xE1 de nuevo:${ANSI_RESET} `);
        return;
      }
      this.selectedTitle = commitTitles[n - 1];
      const type2 = this.selectedTitle.split(":")[0].trim();
      const descriptions2 = commitDescriptionsByType[type2];
      if (!descriptions2) {
        this.finish(this.selectedTitle);
        return;
      }
      this.stage = "description";
      this.printDescriptionMenu(descriptions2);
      return;
    }
    const type = this.selectedTitle.split(":")[0].trim();
    const descriptions = commitDescriptionsByType[type];
    if (!(n >= 1 && n <= descriptions.length)) {
      this.writeEmitter.fire(`${ANSI_DIM}Ese n\xFAmero no existe, prob\xE1 de nuevo:${ANSI_RESET} `);
      return;
    }
    this.finish(this.selectedTitle, descriptions[n - 1]);
  }
  async finish(title, description) {
    const message = description ? `${title}

${description}` : title;
    this.repo.inputBox.value = message;
    await vscode.commands.executeCommand("workbench.view.scm");
    try {
      const hasStagedChanges = this.repo.state.indexChanges.length > 0;
      await this.repo.commit(message, hasStagedChanges ? {} : { all: true });
      this.writeEmitter.fire(`\r
${ANSI_BOLD}\u2714 Commit realizado.${ANSI_RESET}\r
`);
    } catch (err) {
      this.writeEmitter.fire(
        `\r
${ANSI_BOLD}\u2716 No se pudo hacer el commit: ${err?.message ?? err}${ANSI_RESET}\r
`
      );
      this.writeEmitter.fire(
        `${ANSI_DIM}El mensaje ya est\xE1 cargado en "Source Control" \u2014 revis\xE1 ah\xED y presion\xE1 "Commit" manualmente.${ANSI_RESET}\r
`
      );
      this.closeEmitter.fire(0);
      return;
    }
    try {
      await this.repo.push();
      this.writeEmitter.fire(`${ANSI_BOLD}\u2714 Push realizado.${ANSI_RESET}\r
`);
    } catch (err) {
      this.writeEmitter.fire(
        `${ANSI_DIM}El commit se hizo, pero el push fall\xF3: ${err?.message ?? err}${ANSI_RESET}\r
`
      );
      this.writeEmitter.fire(`${ANSI_DIM}Hac\xE9 push manualmente desde "Source Control" cuando quieras.${ANSI_RESET}\r
`);
    }
    this.closeEmitter.fire(0);
  }
};
async function cmdCommitMessagePicker() {
  const repo = await getFirstRepo();
  if (!repo) {
    return;
  }
  const pty = new CommitMenuPty(repo);
  const terminal = vscode.window.createTerminal({ name: "Commit Message", pty });
  terminal.show();
}
var CONSOLE_MARKER = "[ProKeybindings]";
var RETURN_REGEX = /^(\s*)return\b/;
var RETURN_BARE_REGEX = /^\s*return\s*;?\s*$/;
var CONSOLE_LOG_LINE_REGEX = /^\s*console\.log\(.*\)\s*;?\s*$/;
var FUNC_DECL_REGEX = /^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/;
var FUNC_ARROW_REGEX = /^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*(?::[^=]+)?=>\s*\{?\s*$/;
var SUCCESS_NAME_REGEX = /^(load|init|initialize|fetch|create)/i;
var ELSE_IF_PREFIX = /^(\s*)\}?\s*else if\s*\(/;
var IF_PREFIX = /^(\s*)\}?\s*if\s*\(/;
var ELSE_PREFIX = /^(\s*)\}?\s*else\b/;
var CASE_REGEX = /^(\s*)case\s+(.+):\s*$/;
var DEFAULT_REGEX = /^(\s*)default\s*:\s*$/;
var CATCH_PREFIX = /^(\s*)\}?\s*catch\s*\(/;
function findMatchingParenEnd(text, fromIndex) {
  let depth = 1;
  for (let idx = fromIndex; idx < text.length; idx++) {
    if (text[idx] === "(") {
      depth++;
    } else if (text[idx] === ")") {
      depth--;
      if (depth === 0) {
        return idx;
      }
    }
  }
  return -1;
}
function matchIfLike(text, prefixRegex) {
  const m = text.match(prefixRegex);
  if (!m) {
    return void 0;
  }
  const openIndex = m[0].length;
  const closeIndex = findMatchingParenEnd(text, openIndex);
  if (closeIndex === -1) {
    return void 0;
  }
  return {
    indent: m[1],
    condition: text.slice(openIndex, closeIndex).trim(),
    rest: text.slice(closeIndex + 1).trim()
  };
}
function matchBranch(text) {
  const elseIf = matchIfLike(text, ELSE_IF_PREFIX);
  if (elseIf) {
    const isBlock = elseIf.rest === "" || elseIf.rest === "{";
    return { indent: elseIf.indent, label: `else if (${elseIf.condition})`, isBlock, singleLineBody: isBlock ? void 0 : elseIf.rest };
  }
  const ifLike = matchIfLike(text, IF_PREFIX);
  if (ifLike) {
    const isBlock = ifLike.rest === "" || ifLike.rest === "{";
    return { indent: ifLike.indent, label: `if (${ifLike.condition})`, isBlock, singleLineBody: isBlock ? void 0 : ifLike.rest };
  }
  const elseMatch = text.match(ELSE_PREFIX);
  if (elseMatch) {
    const rest = text.slice(elseMatch[0].length).trim();
    if (!/^if\b/.test(rest)) {
      const isBlock = rest === "" || rest === "{";
      return { indent: elseMatch[1], label: "else", isBlock, singleLineBody: isBlock ? void 0 : rest };
    }
  }
  const caseMatch = text.match(CASE_REGEX);
  if (caseMatch) {
    return { indent: caseMatch[1], label: `case ${caseMatch[2].trim()}`, isBlock: true };
  }
  const defaultMatch = text.match(DEFAULT_REGEX);
  if (defaultMatch) {
    return { indent: defaultMatch[1], label: "default", isBlock: true };
  }
  return void 0;
}
function matchCatch(text) {
  const m = text.match(CATCH_PREFIX);
  if (!m) {
    return void 0;
  }
  const openIndex = m[0].length;
  const closeIndex = findMatchingParenEnd(text, openIndex);
  if (closeIndex === -1) {
    return void 0;
  }
  const inside = text.slice(openIndex, closeIndex).trim();
  if (!inside) {
    return void 0;
  }
  const paramName = inside.split(":")[0].trim();
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(paramName)) {
    return void 0;
  }
  const rest = text.slice(closeIndex + 1).trim();
  return { indent: m[1], paramName, isBlock: rest === "" || rest === "{" };
}
var CODE_FILE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".vue",
  ".svelte",
  ".astro"
]);
var REACT_IMPORT_REGEX = /^\s*import\s.+from\s+['"]react['"]\s*;?\s*$/;
var SWITCH_PREFIX = /^(\s*)switch\s*\(/;
var CONSOLE_DEBUG_LINE_REGEX = /^\s*console\.debug\(.*\)\s*;?\s*$/;
var COMMENTED_CONSOLE_REGEX = /^\s*\/\/\s*console\.(log|debug)\(/;
var IMPORT_LINE_REGEX = /^\s*import\s.+from\s+['"](.+)['"]\s*;?\s*$/;
var indentOf = (s) => s.slice(0, s.length - s.trimStart().length);
function findReactImportLines(text) {
  return text.split(/\r\n|\n/).filter((l) => REACT_IMPORT_REGEX.test(l));
}
async function restoreProtectedReactImports(doc, originalReactLines) {
  if (originalReactLines.length === 0) {
    return;
  }
  const currentLines = doc.getText().split(/\r\n|\n/);
  const currentReactIndices = currentLines.map((l, idx) => ({ l, idx })).filter(({ l }) => REACT_IMPORT_REGEX.test(l));
  const edit = new vscode.WorkspaceEdit();
  if (currentReactIndices.length === originalReactLines.length) {
    currentReactIndices.forEach(({ idx, l }, i) => {
      if (l !== originalReactLines[i]) {
        edit.replace(doc.uri, doc.lineAt(idx).range, originalReactLines[i]);
      }
    });
  } else {
    const missing = originalReactLines.filter((orig) => !currentLines.includes(orig));
    if (missing.length > 0) {
      const anchorIdx = currentReactIndices.length > 0 ? currentReactIndices[currentReactIndices.length - 1].idx : 0;
      const anchorLine = doc.lineAt(Math.min(anchorIdx, doc.lineCount - 1));
      edit.insert(doc.uri, anchorLine.range.end, "\n" + missing.join("\n"));
    }
  }
  if (edit.size > 0) {
    await vscode.workspace.applyEdit(edit);
  }
}
function cleanupConsoleLines(originalLines, opts = {}) {
  const isOwnConsoleLine = (line) => {
    const t = line.trim();
    return t.startsWith("console.") && t.includes(CONSOLE_MARKER);
  };
  let removedCount = 0;
  const lines = originalLines.filter((line) => {
    const drop = isOwnConsoleLine(line) || CONSOLE_LOG_LINE_REGEX.test(line) || CONSOLE_DEBUG_LINE_REGEX.test(line) || opts.dropDebugComments === true && COMMENTED_CONSOLE_REGEX.test(line);
    if (drop) removedCount++;
    return !drop;
  });
  const inserts = [];
  const placeStatement = (i, ownIndent, isBlock, statement) => {
    const keyword = statement.split("(")[0];
    if (!isBlock) {
      inserts.push({ targetLine: i, indent: ownIndent, statement });
      return;
    }
    const nextIndex = i + 1;
    if (nextIndex >= lines.length) {
      return;
    }
    const nextText = lines[nextIndex];
    const nextIndent = indentOf(nextText);
    if (!nextText.trim() || nextIndent.length <= ownIndent.length) {
      return;
    }
    if (nextText.trim().startsWith(keyword)) {
      return;
    }
    inserts.push({ targetLine: nextIndex, indent: nextIndent, statement });
  };
  const stack = [];
  let depth = 0;
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    const trimmed = text.trim();
    const funcMatch = trimmed && (text.match(FUNC_DECL_REGEX) || text.match(FUNC_ARROW_REGEX));
    const opens = (text.match(/\{/g) || []).length;
    const closes = (text.match(/\}/g) || []).length;
    if (funcMatch) {
      stack.push({ name: funcMatch[1], openDepth: depth + opens, bodyIndent: null });
    }
    depth += opens - closes;
    while (stack.length && depth < stack[stack.length - 1].openDepth) {
      stack.pop();
    }
    const current = stack.length ? stack[stack.length - 1] : void 0;
    if (current && current.bodyIndent === null && trimmed && !funcMatch) {
      current.bodyIndent = indentOf(text);
    }
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) {
      continue;
    }
    const funcLabel = current ? current.name : "archivo";
    const catchMatch = matchCatch(text);
    if (catchMatch) {
      const statement = `console.error(${JSON.stringify(`${CONSOLE_MARKER} ${funcLabel}: error.`)}, ${catchMatch.paramName});`;
      placeStatement(i, catchMatch.indent, catchMatch.isBlock, statement);
      continue;
    }
    if (RETURN_BARE_REGEX.test(text)) {
      const indent = indentOf(text);
      const prevText = lines[i - 1] ?? "";
      if (!prevText.trim().startsWith("console.warn")) {
        const statement = `console.warn(${JSON.stringify(`${CONSOLE_MARKER} ${funcLabel}: condici\xF3n no cumplida, se cancela.`)});`;
        inserts.push({ targetLine: i, indent, statement });
      }
      continue;
    }
    const returnMatch = text.match(RETURN_REGEX);
    if (returnMatch && current && current.bodyIndent === returnMatch[1] && SUCCESS_NAME_REGEX.test(current.name)) {
      const prevText = lines[i - 1] ?? "";
      if (!prevText.trim().startsWith("console.info")) {
        const statement = `console.info(${JSON.stringify(`${CONSOLE_MARKER} ${current.name}: proceso finalizado correctamente.`)});`;
        inserts.push({ targetLine: i, indent: returnMatch[1], statement });
      }
      continue;
    }
    const branch = matchBranch(text);
    if (!branch) {
      continue;
    }
    if (!branch.isBlock && RETURN_BARE_REGEX.test(branch.singleLineBody ?? "")) {
      const statement = `console.warn(${JSON.stringify(`${CONSOLE_MARKER} ${funcLabel}: ${branch.label} sin motivo indicado.`)});`;
      inserts.push({ targetLine: i, indent: branch.indent, statement });
      continue;
    }
    if (branch.isBlock) {
      const nextText = lines[i + 1] ?? "";
      const nextTrim = nextText.trim();
      const isEmptyBlock = nextTrim === "}" || nextTrim === "";
      const isBareReturnBlock = RETURN_BARE_REGEX.test(nextText);
      if (isEmptyBlock || isBareReturnBlock) {
        const statement = `console.warn(${JSON.stringify(`${CONSOLE_MARKER} ${funcLabel}: ${branch.label} sin motivo indicado.`)});`;
        placeStatement(i, branch.indent, true, statement);
      }
    }
  }
  inserts.sort((a, b) => b.targetLine - a.targetLine);
  for (const ins of inserts) {
    lines.splice(ins.targetLine, 0, `${ins.indent}${ins.statement}`);
  }
  return { lines, removedCount, insertedCount: inserts.length };
}
function trimAndCollapseBlankLines(lines) {
  const trimmed = lines.map((line) => line.replace(/[ \t]+$/, ""));
  const collapsed = [];
  for (const line of trimmed) {
    if (line === "" && collapsed[collapsed.length - 1] === "") {
      continue;
    }
    collapsed.push(line);
  }
  return collapsed;
}
function normalizeIndentation(lines) {
  const stack = [];
  let changed = false;
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      result.push(line);
      continue;
    }
    const currentIndent = indentOf(line);
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (currentIndent.length <= top.indent.length) {
        stack.pop();
      } else {
        break;
      }
    }
    let expectedIndent = "";
    if (stack.length > 0) {
      expectedIndent = stack[stack.length - 1].indent + "  ";
    }
    let newLine = line;
    if (trimmed && currentIndent !== expectedIndent && !trimmed.startsWith("//") && !trimmed.startsWith("*")) {
      newLine = expectedIndent + trimmed;
      if (newLine !== line) {
        changed = true;
      }
    }
    result.push(newLine);
    if (opens > closes) {
      stack.push({ indent: expectedIndent, depth: stack.length });
    }
  }
  return { lines: result, changed };
}
function cleanupClosingBrackets(lines) {
  let changed = false;
  const result = lines.map((line) => {
    const original = line;
    line = line.replace(/\s+\}/g, "}").replace(/\s+\)/g, ")").replace(/\s+\]/g, "]").replace(/\s+;/g, ";").replace(/\s+>/g, ">").replace(/\s+\/>/g, "/>").replace(/\s+\?>/g, "?>");
    if (line !== original) changed = true;
    return line;
  });
  return { lines: result, changed };
}
function cleanupObjectLiterals(lines) {
  let changed = false;
  const result = lines.map((line) => {
    const original = line;
    line = line.replace(/,+\s*}}/g, "}}").replace(/,+\s*}/g, "}").replace(/,+\s*]/g, "]").replace(/,+\s*\)/g, ")").replace(/{\s+}/g, "{}").replace(/\[\s+]/g, "[]").replace(/\{\s+/g, "{").replace(/\s+}}/g, "}}").replace(/\s+}/g, "}").replace(/\s+,\s+/g, ", ").replace(/,\s*,+/g, ",").replace(/:\s+/g, ": ").replace(/\s+:/g, ":");
    if (line !== original) changed = true;
    return line;
  });
  return { lines: result, changed };
}
function trimStringContents(lines) {
  let changed = false;
  const result = lines.map((line) => {
    const original = line;
    line = line.replace(/"([^"]*)"/g, (match, content) => {
      const trimmed = content.trim();
      if (trimmed !== content) {
        return `"${trimmed}"`;
      }
      return match;
    });
    line = line.replace(/'([^']*)'/g, (match, content) => {
      const trimmed = content.trim();
      if (trimmed !== content) {
        return `'${trimmed}'`;
      }
      return match;
    });
    line = line.replace(/`([^`]*)`/g, (match, content) => {
      const trimmed = content.trim();
      if (trimmed !== content) {
        return `\`${trimmed}\``;
      }
      return match;
    });
    if (line !== original) changed = true;
    return line;
  });
  return { lines: result, changed };
}
function collapseStyleObjects(lines) {
  let changed = false;
  const result = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const styleMatch = line.match(/^(\s*)(.*)style=\{\{/);
    if (!styleMatch) {
      result.push(line);
      i++;
      continue;
    }
    const indent = styleMatch[1];
    const prefix = styleMatch[2];
    const startLine = line;
    let collected = line.substring(line.indexOf("style={{") + 8);
    let depth = 1;
    let j = i + 1;
    while (j < lines.length && depth > 0) {
      const nextLine = lines[j];
      const text = nextLine.trim();
      for (const char of text) {
        if (char === "{") depth++;
        else if (char === "}") depth--;
      }
      if (depth > 0) {
        collected += " " + text;
      } else {
        const endIdx = nextLine.indexOf("}");
        if (endIdx >= 0) {
          collected += " " + nextLine.substring(0, endIdx);
        }
        collected += nextLine.substring(nextLine.lastIndexOf("}"));
      }
      j++;
    }
    collected = collected.replace(/\s+/g, " ").replace(/:\s+/g, ": ").replace(/,\s+/g, ", ").trim();
    const collapsedLine = `${indent}${prefix}style={{${collected}`;
    result.push(collapsedLine);
    changed = true;
    i = j;
  }
  return { lines: result, changed };
}
function addMissingSwitchDefaults(lines) {
  const inserts = [];
  for (let i = 0; i < lines.length; i++) {
    const switchMatch = lines[i].match(SWITCH_PREFIX);
    if (!switchMatch) {
      continue;
    }
    const switchIndent = switchMatch[1];
    let depth = 0;
    let closeIndex = -1;
    let caseIndent = `${switchIndent}  `;
    let hasDefault = false;
    for (let j = i; j < lines.length; j++) {
      const opens = (lines[j].match(/\{/g) || []).length;
      const closes = (lines[j].match(/\}/g) || []).length;
      depth += opens - closes;
      const caseMatch = lines[j].match(CASE_REGEX);
      if (caseMatch && closeIndex === -1) {
        caseIndent = caseMatch[1];
      }
      if (DEFAULT_REGEX.test(lines[j])) {
        hasDefault = true;
      }
      if (depth === 0 && j > i) {
        closeIndex = j;
        break;
      }
    }
    if (closeIndex === -1 || hasDefault) {
      continue;
    }
    const funcNameMatch = lines.slice(0, i).reverse().map((l) => l.match(FUNC_DECL_REGEX) || l.match(FUNC_ARROW_REGEX)).find(Boolean);
    const funcLabel = funcNameMatch ? funcNameMatch[1] : "archivo";
    inserts.push({
      targetLine: closeIndex,
      indent: caseIndent,
      statement: `default:
${caseIndent}  console.warn(${JSON.stringify(`${CONSOLE_MARKER} Caso no controlado en ${funcLabel}.`)});
${caseIndent}  break;`
    });
  }
  inserts.sort((a, b) => b.targetLine - a.targetLine);
  const result = [...lines];
  for (const ins of inserts) {
    result.splice(ins.targetLine, 0, `${ins.indent}${ins.statement}`);
  }
  return { lines: result, addedCount: inserts.length };
}
function organizeImportGroups(lines) {
  let end = 0;
  while (end < lines.length) {
    const t = lines[end].trim();
    if (t === "" || IMPORT_LINE_REGEX.test(lines[end]) || t.startsWith("//") || REACT_IMPORT_REGEX.test(lines[end])) {
      end++;
      continue;
    }
    break;
  }
  if (end === 0) {
    return { lines, changed: false };
  }
  const head = lines.slice(0, end);
  const sortSegment = (segment) => {
    const external = [];
    const internal = [];
    const relative = [];
    for (const line of segment) {
      if (!line.trim()) continue;
      const m = line.match(IMPORT_LINE_REGEX);
      if (!m) continue;
      const spec = m[1];
      if (spec.startsWith(".")) relative.push(line);
      else if (spec.startsWith("@/") || spec.startsWith("~/")) internal.push(line);
      else external.push(line);
    }
    const groups = [external, internal, relative].filter((g) => g.length > 0);
    return groups.map((g) => g.join("\n")).join("\n\n").split("\n");
  };
  const newHeadParts = [];
  let chunkStart = 0;
  for (let i = 0; i <= head.length; i++) {
    const isPin = i < head.length && REACT_IMPORT_REGEX.test(head[i]);
    if (isPin || i === head.length) {
      const chunk = sortSegment(head.slice(chunkStart, i));
      if (chunk.length > 0 && chunk.some((l) => l.trim())) {
        if (newHeadParts.length > 0) newHeadParts.push("");
        newHeadParts.push(...chunk);
      }
      if (isPin) {
        if (newHeadParts.length > 0) newHeadParts.push("");
        newHeadParts.push(head[i]);
      }
      chunkStart = i + 1;
    }
  }
  const changed = newHeadParts.join("\n") !== head.join("\n");
  return { lines: [...newHeadParts, ...lines.slice(end)], changed };
}
async function cmdFormatWithConsoles() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Pro Keybindings: no hay ning\xFAn editor activo.");
    return;
  }
  const doc = editor.document;
  if (!CODE_FILE_EXTENSIONS.has(path.extname(doc.fileName).toLowerCase())) {
    vscode.window.showWarningMessage("Pro Keybindings: este comando solo funciona en archivos .ts/.tsx/.js/.jsx/.mjs/.cjs/.vue/.svelte/.astro.");
    return;
  }
  const eol = doc.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
  const originalReactLines = findReactImportLines(doc.getText());
  const originalLines = doc.getText().split(/\r\n|\n/);
  const { lines, removedCount, insertedCount } = cleanupConsoleLines(originalLines);
  const collapsedLines = trimAndCollapseBlankLines(lines);
  const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length));
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.replace(doc.uri, fullRange, collapsedLines.join(eol));
  await vscode.workspace.applyEdit(workspaceEdit);
  try {
    await vscode.commands.executeCommand("editor.action.organizeImports");
  } catch {
  }
  try {
    await vscode.commands.executeCommand("editor.action.formatDocument");
  } catch {
  }
  await restoreProtectedReactImports(doc, originalReactLines);
  vscode.window.showInformationMessage(
    `Pro Keybindings: ${removedCount} console.log eliminados, ${insertedCount} console.error/warn/info agregados, archivo formateado.`
  );
}
async function cmdSuperClean() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Pro Keybindings: no hay ning\xFAn editor activo.");
    return;
  }
  const doc = editor.document;
  if (!CODE_FILE_EXTENSIONS.has(path.extname(doc.fileName).toLowerCase())) {
    vscode.window.showWarningMessage("Pro Keybindings: este comando solo funciona en archivos .ts/.tsx/.js/.jsx/.mjs/.cjs/.vue/.svelte/.astro.");
    return;
  }
  const eol = doc.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
  const originalReactLines = findReactImportLines(doc.getText());
  const originalLines = doc.getText().split(/\r\n|\n/);
  const { lines: consoleLines, removedCount, insertedCount } = cleanupConsoleLines(originalLines, { dropDebugComments: true });
  const { lines: withDefaults, addedCount: defaultsAdded } = addMissingSwitchDefaults(consoleLines);
  const { lines: withImports, changed: importsRegrouped } = organizeImportGroups(withDefaults);
  const collapsedLines = trimAndCollapseBlankLines(withImports);
  const { lines: normalizedLines, changed: indentNormalized } = normalizeIndentation(collapsedLines);
  const { lines: cleanedBrackets, changed: bracketsChanged } = cleanupClosingBrackets(normalizedLines);
  const { lines: cleanedObjects, changed: objectsChanged } = cleanupObjectLiterals(cleanedBrackets);
  const { lines: cleanedStrings, changed: stringsChanged } = trimStringContents(cleanedObjects);
  const { lines: collapsedStyles, changed: stylesChanged } = collapseStyleObjects(cleanedStrings);
  const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length));
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.replace(doc.uri, fullRange, collapsedStyles.join(eol));
  await vscode.workspace.applyEdit(workspaceEdit);
  try {
    await vscode.commands.executeCommand("editor.action.organizeImports");
  } catch {
  }
  try {
    await vscode.commands.executeCommand("editor.action.addMissingImports");
  } catch {
  }
  try {
    await vscode.commands.executeCommand("editor.action.formatDocument");
  } catch {
  }
  await restoreProtectedReactImports(doc, originalReactLines);
  vscode.window.showInformationMessage(
    `Pro Keybindings \u26A1 Super: ${removedCount} console.log/debug eliminados, ${insertedCount} console.error/warn/info agregados, ${defaultsAdded} default agregados a switch, imports ${importsRegrouped ? "reagrupados" : "sin cambios"}, importaciones faltantes agregadas, indentaci\xF3n ${indentNormalized ? "normalizada" : "sin cambios"}, espacios/comas ${bracketsChanged || objectsChanged ? "limpios" : "sin cambios"}, strings ${stringsChanged ? "trimeados" : "sin cambios"}, styles ${stylesChanged ? "colapsados" : "sin cambios"}, archivo formateado.`
  );
}
async function cmdOpenAsNewProject(uri) {
  const target = uri ?? vscode.window.activeTextEditor?.document.uri;
  if (!target) {
    vscode.window.showWarningMessage("Pro Keybindings: no hay ning\xFAn archivo o carpeta seleccionado.");
    return;
  }
  let folderPath = target.fsPath;
  try {
    if (!fs.statSync(folderPath).isDirectory()) {
      folderPath = path.dirname(folderPath);
    }
  } catch {
    vscode.window.showWarningMessage("Pro Keybindings: no se pudo acceder a la ruta seleccionada.");
    return;
  }
  await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(folderPath), {
    forceNewWindow: true
  });
}
async function cmdOpenSelectedFolderInNewWindow() {
  const previousClipboard = await vscode.env.clipboard.readText();
  await vscode.commands.executeCommand("copyFilePath");
  const copiedPath = (await vscode.env.clipboard.readText()).split(/\r?\n/)[0].trim();
  await vscode.env.clipboard.writeText(previousClipboard);
  if (!copiedPath) {
    vscode.window.showWarningMessage("Pro Keybindings: no hay ninguna carpeta seleccionada en el Explorador.");
    return;
  }
  await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(copiedPath), {
    forceNewWindow: true
  });
}
async function cmdCleanupProjectImports() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage("Pro Keybindings: no hay ninguna carpeta de proyecto abierta.");
    return;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const files = [];
  const codeExtensions = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".vue", ".svelte", ".astro"];
  const findFiles = async (dir) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist") {
          continue;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await findFiles(fullPath);
        } else if (codeExtensions.some((ext) => entry.name.endsWith(ext))) {
          files.push(vscode.Uri.file(fullPath));
        }
      }
    } catch {
    }
  };
  await findFiles(rootPath);
  if (files.length === 0) {
    vscode.window.showWarningMessage("Pro Keybindings: no se encontraron archivos de c\xF3digo.");
    return;
  }
  let processed = 0;
  for (const fileUri of files) {
    try {
      const doc = await vscode.workspace.openTextDocument(fileUri);
      const editor = await vscode.window.showTextDocument(doc, { preview: true });
      const originalReactLines = findReactImportLines(doc.getText());
      try {
        await vscode.commands.executeCommand("editor.action.organizeImports");
      } catch {
      }
      try {
        await vscode.commands.executeCommand("editor.action.formatDocument");
      } catch {
      }
      await restoreProtectedReactImports(doc, originalReactLines);
      if (doc.isDirty) {
        await doc.save();
        processed++;
      }
      await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
    } catch (err) {
      console.error(`Error procesando ${fileUri.fsPath}:`, err?.message);
    }
  }
  vscode.window.showInformationMessage(
    `Pro Keybindings: ${processed} archivos procesados, importaciones organizadas en todo el proyecto.`
  );
}
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("proKeybindings.detectProjectType", cmdDetectProjectType),
    vscode.commands.registerCommand("proKeybindings.smartRun", cmdSmartRun),
    vscode.commands.registerCommand("proKeybindings.quickCommit", cmdQuickCommit),
    vscode.commands.registerCommand("proKeybindings.openGitHubDesktop", cmdOpenGitHubDesktop),
    vscode.commands.registerCommand("proKeybindings.commitMessagePicker", cmdCommitMessagePicker),
    vscode.commands.registerCommand("proKeybindings.formatWithConsoles", cmdFormatWithConsoles),
    vscode.commands.registerCommand("proKeybindings.superClean", cmdSuperClean),
    vscode.commands.registerCommand("proKeybindings.openAsNewProject", cmdOpenAsNewProject),
    vscode.commands.registerCommand("proKeybindings.openSelectedFolderInNewWindow", cmdOpenSelectedFolderInNewWindow),
    vscode.commands.registerCommand("proKeybindings.cleanupProjectImports", cmdCleanupProjectImports)
  );
}
function deactivate() {
  sharedTerminal?.dispose();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate,
  detectProjectType
});
