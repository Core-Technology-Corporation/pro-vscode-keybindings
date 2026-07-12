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
${ANSI_BOLD}Eleg\xED el t\xEDtulo del commit:${ANSI_RESET}\r
\r
`);
    commitTitles.forEach((title, i) => {
      this.writeEmitter.fire(`${colorFor(title)}  ${i + 1}) ${title}${ANSI_RESET}\r
`);
    });
    this.writeEmitter.fire(`\r
${ANSI_DIM}Escrib\xED un n\xFAmero y Enter:${ANSI_RESET} `);
  }
  printDescriptionMenu(descriptions) {
    this.writeEmitter.fire(`\r
${ANSI_BOLD}Eleg\xED la descripci\xF3n del commit:${ANSI_RESET}\r
\r
`);
    descriptions.forEach((desc, i) => {
      this.writeEmitter.fire(`${colorFor(desc)}  ${i + 1}) ${desc}${ANSI_RESET}\r
`);
    });
    this.writeEmitter.fire(`\r
${ANSI_DIM}Escrib\xED un n\xFAmero y Enter:${ANSI_RESET} `);
  }
  onEnter() {
    const n = parseInt(this.buffer, 10);
    this.buffer = "";
    if (this.stage === "title") {
      if (!(n >= 1 && n <= commitTitles.length)) {
        this.writeEmitter.fire(`${ANSI_DIM}Opci\xF3n inv\xE1lida.${ANSI_RESET} `);
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
      this.writeEmitter.fire(`${ANSI_DIM}Opci\xF3n inv\xE1lida.${ANSI_RESET} `);
      return;
    }
    this.finish(this.selectedTitle, descriptions[n - 1]);
  }
  async finish(title, description) {
    this.repo.inputBox.value = description ? `${title}

${description}` : title;
    this.writeEmitter.fire(`\r
${ANSI_BOLD}\u2714 Commit box actualizado.${ANSI_RESET}\r
`);
    await vscode.commands.executeCommand("workbench.view.scm");
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
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("proKeybindings.detectProjectType", cmdDetectProjectType),
    vscode.commands.registerCommand("proKeybindings.smartRun", cmdSmartRun),
    vscode.commands.registerCommand("proKeybindings.quickCommit", cmdQuickCommit),
    vscode.commands.registerCommand("proKeybindings.openGitHubDesktop", cmdOpenGitHubDesktop),
    vscode.commands.registerCommand("proKeybindings.commitMessagePicker", cmdCommitMessagePicker)
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
