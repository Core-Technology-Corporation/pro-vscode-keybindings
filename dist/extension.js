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
async function cmdQuickCommit() {
  const gitExtension = vscode.extensions.getExtension("vscode.git");
  if (!gitExtension) {
    vscode.window.showWarningMessage("Pro Keybindings: la extensi\xF3n de Git de VS Code no est\xE1 disponible.");
    return;
  }
  const git = gitExtension.isActive ? gitExtension.exports : await gitExtension.activate();
  const api = git.getAPI(1);
  const repo = api.repositories[0];
  if (!repo) {
    vscode.window.showWarningMessage("Pro Keybindings: no se encontr\xF3 ning\xFAn repositorio Git abierto.");
    return;
  }
  repo.inputBox.value = "chore: update\n\nworking";
  await vscode.commands.executeCommand("workbench.view.scm");
}
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("proKeybindings.detectProjectType", cmdDetectProjectType),
    vscode.commands.registerCommand("proKeybindings.smartRun", cmdSmartRun),
    vscode.commands.registerCommand("proKeybindings.quickCommit", cmdQuickCommit),
    vscode.commands.registerCommand("proKeybindings.openGitHubDesktop", cmdOpenGitHubDesktop)
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
