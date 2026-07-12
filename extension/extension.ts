import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let sharedTerminal: vscode.Terminal | undefined;

function getTerminal(): vscode.Terminal {
  if (!sharedTerminal || sharedTerminal.exitStatus !== undefined) {
    sharedTerminal = vscode.window.createTerminal('Pro Keybindings');
  }
  sharedTerminal.show();
  return sharedTerminal;
}

function runInTerminal(command: string): void {
  getTerminal().sendText(command, true);
}

function readJson(filePath: string): any | undefined {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return undefined;
  }
}

function hasJavaFile(dir: string, depth = 0): boolean {
  if (depth > 4) {
    return false;
  }
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (hasJavaFile(full, depth + 1)) {
        return true;
      }
    } else if (entry.name.endsWith('.java')) {
      return true;
    }
  }
  return false;
}

export function detectProjectType(root: string): string {
  const pkgPath = path.join(root, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = readJson(pkgPath) ?? {};
    if (pkg.engines?.vscode) {
      return 'VS Code Extension';
    }
    const deps: Record<string, string> = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    if ('next' in deps) return 'Next.js';
    if ('react-native' in deps) return 'React Native';
    if ('react' in deps) return 'React';
    if ('vue' in deps) return 'Vue';
    if ('@angular/core' in deps) return 'Angular';
    if ('express' in deps) return 'Node.js / Express';
    return 'Node.js';
  }
  if (fs.existsSync(path.join(root, 'pyproject.toml'))) return 'Python (pyproject.toml)';
  if (fs.existsSync(path.join(root, 'requirements.txt'))) return 'Python (requirements.txt)';
  if (fs.existsSync(path.join(root, 'go.mod'))) return 'Go';
  if (fs.existsSync(path.join(root, 'Cargo.toml'))) return 'Rust';
  if (fs.existsSync(path.join(root, 'pom.xml'))) return 'Java (Maven)';
  if (fs.existsSync(path.join(root, 'build.gradle'))) return 'Java / Kotlin (Gradle)';
  if (hasJavaFile(root)) return 'Java (sin Maven/Gradle)';
  if (fs.existsSync(path.join(root, 'index.html'))) return 'HTML/CSS/JS estatico';
  return 'No detectado';
}

function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

async function cmdDetectProjectType(): Promise<void> {
  const root = getWorkspaceRoot();
  if (!root) {
    vscode.window.showWarningMessage('Pro Keybindings: no hay ninguna carpeta abierta.');
    return;
  }
  const tipo = detectProjectType(root);
  runInTerminal(`echo "Tipo de proyecto: ${tipo}"`);
}

interface SmartRunOption extends vscode.QuickPickItem {
  run: () => void | Promise<void>;
}

async function cmdSmartRun(): Promise<void> {
  const options: SmartRunOption[] = [
    {
      label: 'HTML',
      description: 'Abrir con Live Server',
      run: async () => {
        if (!vscode.extensions.getExtension('ritwickdey.LiveServer')) {
          vscode.window.showWarningMessage(
            'Instala la extensión "Live Server" (ritwickdey.LiveServer) para usar esta opción.'
          );
          return;
        }
        await vscode.commands.executeCommand('extension.liveServer.goOnline');
      }
    },
    {
      label: 'React',
      description: 'npm run web',
      run: () => runInTerminal('npm run web')
    },
    {
      label: 'Java',
      description: 'Depurar (Start Debugging)',
      run: () => vscode.commands.executeCommand('workbench.action.debug.start')
    },
    {
      label: 'React Native',
      description: 'npm start',
      run: () => runInTerminal('npm start')
    },
    {
      label: 'Extension',
      description: 'vsce package',
      run: () => runInTerminal('npx vsce package')
    }
  ];

  const pick = await vscode.window.showQuickPick(options, {
    placeHolder: '¿Qué quieres ejecutar?'
  });
  await pick?.run();
}

async function cmdOpenGitHubDesktop(): Promise<void> {
  const root = getWorkspaceRoot();
  if (!root) {
    vscode.window.showWarningMessage('Pro Keybindings: no hay ninguna carpeta abierta.');
    return;
  }
  runInTerminal(`github "${root}"`);
}

async function cmdQuickCommit(): Promise<void> {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    vscode.window.showWarningMessage('Pro Keybindings: la extensión de Git de VS Code no está disponible.');
    return;
  }
  const git = gitExtension.isActive ? gitExtension.exports : await gitExtension.activate();
  const api = git.getAPI(1);
  const repo = api.repositories[0];
  if (!repo) {
    vscode.window.showWarningMessage('Pro Keybindings: no se encontró ningún repositorio Git abierto.');
    return;
  }
  repo.inputBox.value = 'update\n\nesto es una actualizacion';
  await vscode.commands.executeCommand('workbench.view.scm');
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('proKeybindings.detectProjectType', cmdDetectProjectType),
    vscode.commands.registerCommand('proKeybindings.smartRun', cmdSmartRun),
    vscode.commands.registerCommand('proKeybindings.quickCommit', cmdQuickCommit),
    vscode.commands.registerCommand('proKeybindings.openGitHubDesktop', cmdOpenGitHubDesktop)
  );
}

export function deactivate(): void {
  sharedTerminal?.dispose();
}
