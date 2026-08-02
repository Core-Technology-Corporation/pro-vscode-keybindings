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

async function getFirstRepo(): Promise<any | undefined> {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    vscode.window.showWarningMessage('Pro Keybindings: la extensión de Git de VS Code no está disponible.');
    return undefined;
  }
  const git = gitExtension.isActive ? gitExtension.exports : await gitExtension.activate();
  const api = git.getAPI(1);
  const repo = api.repositories[0];
  if (!repo) {
    vscode.window.showWarningMessage('Pro Keybindings: no se encontró ningún repositorio Git abierto.');
    return undefined;
  }
  return repo;
}

async function cmdQuickCommit(): Promise<void> {
  const repo = await getFirstRepo();
  if (!repo) {
    return;
  }
  repo.inputBox.value = 'chore: update\n\nworking';
  await vscode.commands.executeCommand('workbench.view.scm');
}

const commitTitles = [
  'feat: agrega autenticación con JWT',
  'feat: implementa recuperación de contraseña',
  'fix: corrige validación del formulario',
  'refactor: separa lógica del controlador',
  'style: organiza importaciones',
  'docs: actualiza README',
  'test: agrega pruebas del servicio de usuarios',
  'perf: optimiza consulta de productos',
  'chore: actualiza dependencias'
];

const commitDescriptionsByType: Record<string, string[]> = {
  feat: [
    'feat: Se agregan las columnas solicitadas',
    'feat: Se implementa el carrito de compras',
    'feat: Se crean roles y permisos para el módulo de ventas',
    'feat: Se incorpora el tema oscuro',
    'feat: Se agrega la opción de exportar a Excel',
    'feat: Se implementan filtros de búsqueda',
    'feat: Se agrega paginación al listado de usuarios',
    'feat: Se crea el módulo de reportes'
  ],
  fix: [
    'fix: Se corrige el error al iniciar sesión',
    'fix: Se soluciona el problema al anular registros',
    'fix: Se corrige la validación del formulario',
    'fix: Se repara la navegación entre páginas',
    'fix: Se corrige el cálculo de totales',
    'fix: Se soluciona el error en la carga de imágenes',
    'fix: Se evita la creación de registros duplicados',
    'fix: Se corrige la actualización de datos'
  ],
  docs: [
    'docs: Se actualiza el README',
    'docs: Se agrega la guía de instalación',
    'docs: Se documenta la API',
    'docs: Se corrigen errores ortográficos',
    'docs: Se agregan ejemplos de uso',
    'docs: Se actualiza la documentación del proyecto',
    'docs: Se documentan las nuevas funcionalidades'
  ],
  refactor: [
    'refactor: Se reorganiza la estructura del proyecto',
    'refactor: Se simplifica la lógica de autenticación',
    'refactor: Se separa la lógica del controlador',
    'refactor: Se elimina código duplicado',
    'refactor: Se extraen funciones reutilizables',
    'refactor: Se mejora la organización de componentes',
    'refactor: Se renombran métodos para mayor claridad'
  ],
  test: [
    'test: Se agregan pruebas para el módulo de ventas',
    'test: Se actualizan las pruebas de autenticación',
    'test: Se corrigen las pruebas unitarias',
    'test: Se agregan pruebas de integración',
    'test: Se aumenta la cobertura de pruebas'
  ],
  chore: [
    'chore: Se actualizan las dependencias',
    'chore: Se configura ESLint',
    'chore: Se agrega el script de despliegue',
    'chore: Se actualiza la configuración de Git',
    'chore: Se eliminan archivos temporales',
    'chore: Se reorganiza la configuración del proyecto',
    'chore: Se actualizan las variables de entorno'
  ],
  perf: [
    'perf: Se optimiza la consulta a la base de datos',
    'perf: Se reduce el tiempo de carga',
    'perf: Se optimiza el consumo de memoria',
    'perf: Se mejora el rendimiento de las consultas',
    'perf: Se optimiza la carga de imágenes',
    'perf: Se reducen las peticiones al servidor'
  ]
};

const ANSI_RESET = '\x1b[0m';
const ANSI_BOLD = '\x1b[1m';
const ANSI_DIM = '\x1b[2m';

const typeColors: Record<string, string> = {
  feat: '\x1b[32m', // green
  fix: '\x1b[31m', // red
  refactor: '\x1b[36m', // cyan
  style: '\x1b[35m', // magenta
  docs: '\x1b[34m', // blue
  test: '\x1b[33m', // yellow
  perf: '\x1b[92m', // bright green
  chore: '\x1b[90m' // gray
};

function colorFor(text: string): string {
  const type = text.split(':')[0].trim();
  return typeColors[type] ?? '';
}

class CommitMenuPty implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  onDidWrite = this.writeEmitter.event;
  private closeEmitter = new vscode.EventEmitter<number>();
  onDidClose = this.closeEmitter.event;

  private stage: 'title' | 'description' = 'title';
  private selectedTitle = '';
  private buffer = '';

  constructor(private readonly repo: any) {}

  open(): void {
    this.printTitleMenu();
  }

  close(): void {
    // nothing to clean up
  }

  handleInput(data: string): void {
    if (data === '\r') {
      this.writeEmitter.fire('\r\n');
      this.onEnter();
      return;
    }
    if (data === '\x7f') {
      if (this.buffer.length > 0) {
        this.buffer = this.buffer.slice(0, -1);
        this.writeEmitter.fire('\b \b');
      }
      return;
    }
    if (/^[0-9]$/.test(data)) {
      this.buffer += data;
      this.writeEmitter.fire(data);
    }
  }

  private printTitleMenu(): void {
    this.writeEmitter.fire(`\r\n${ANSI_BOLD}PASO 1 de 2 — ¿Qué tipo de cambio hiciste?${ANSI_RESET}\r\n`);
    this.writeEmitter.fire(`${ANSI_DIM}Esto va a ser el título del commit (lo que verá tu jefe/equipo en el historial de Git).${ANSI_RESET}\r\n\r\n`);
    commitTitles.forEach((title, i) => {
      this.writeEmitter.fire(`${colorFor(title)}  ${i + 1}) ${title}${ANSI_RESET}\r\n`);
    });
    this.writeEmitter.fire(`\r\n${ANSI_DIM}Escribí el número de la opción y presioná Enter:${ANSI_RESET} `);
  }

  private printDescriptionMenu(descriptions: string[]): void {
    this.writeEmitter.fire(`\r\n${ANSI_BOLD}PASO 2 de 2 — Contá con más detalle qué hiciste${ANSI_RESET}\r\n`);
    this.writeEmitter.fire(`${ANSI_DIM}Esto va a ser la descripción del commit, debajo del título.${ANSI_RESET}\r\n\r\n`);
    descriptions.forEach((desc, i) => {
      this.writeEmitter.fire(`${colorFor(desc)}  ${i + 1}) ${desc}${ANSI_RESET}\r\n`);
    });
    this.writeEmitter.fire(`\r\n${ANSI_DIM}Escribí el número de la opción y presioná Enter:${ANSI_RESET} `);
  }

  private onEnter(): void {
    const n = parseInt(this.buffer, 10);
    this.buffer = '';

    if (this.stage === 'title') {
      if (!(n >= 1 && n <= commitTitles.length)) {
        this.writeEmitter.fire(`${ANSI_DIM}Ese número no existe, probá de nuevo:${ANSI_RESET} `);
        return;
      }
      this.selectedTitle = commitTitles[n - 1];
      const type = this.selectedTitle.split(':')[0].trim();
      const descriptions = commitDescriptionsByType[type];
      if (!descriptions) {
        this.finish(this.selectedTitle);
        return;
      }
      this.stage = 'description';
      this.printDescriptionMenu(descriptions);
      return;
    }

    const type = this.selectedTitle.split(':')[0].trim();
    const descriptions = commitDescriptionsByType[type];
    if (!(n >= 1 && n <= descriptions.length)) {
      this.writeEmitter.fire(`${ANSI_DIM}Ese número no existe, probá de nuevo:${ANSI_RESET} `);
      return;
    }
    this.finish(this.selectedTitle, descriptions[n - 1]);
  }

  private async finish(title: string, description?: string): Promise<void> {
    const message = description ? `${title}\n\n${description}` : title;
    this.repo.inputBox.value = message;
    await vscode.commands.executeCommand('workbench.view.scm');

    try {
      const hasStagedChanges = this.repo.state.indexChanges.length > 0;
      await this.repo.commit(message, hasStagedChanges ? {} : { all: true });
      this.writeEmitter.fire(`\r\n${ANSI_BOLD}✔ Commit realizado.${ANSI_RESET}\r\n`);
    } catch (err: any) {
      this.writeEmitter.fire(
        `\r\n${ANSI_BOLD}✖ No se pudo hacer el commit: ${err?.message ?? err}${ANSI_RESET}\r\n`
      );
      this.writeEmitter.fire(
        `${ANSI_DIM}El mensaje ya está cargado en "Source Control" — revisá ahí y presioná "Commit" manualmente.${ANSI_RESET}\r\n`
      );
      this.closeEmitter.fire(0);
      return;
    }

    try {
      await this.repo.push();
      this.writeEmitter.fire(`${ANSI_BOLD}✔ Push realizado.${ANSI_RESET}\r\n`);
    } catch (err: any) {
      this.writeEmitter.fire(
        `${ANSI_DIM}El commit se hizo, pero el push falló: ${err?.message ?? err}${ANSI_RESET}\r\n`
      );
      this.writeEmitter.fire(`${ANSI_DIM}Hacé push manualmente desde "Source Control" cuando quieras.${ANSI_RESET}\r\n`);
    }
    this.closeEmitter.fire(0);
  }
}

async function cmdCommitMessagePicker(): Promise<void> {
  const repo = await getFirstRepo();
  if (!repo) {
    return;
  }
  const pty = new CommitMenuPty(repo);
  const terminal = vscode.window.createTerminal({ name: 'Commit Message', pty });
  terminal.show();
}

const CONSOLE_MARKER = '[ProKeybindings]';
const RETURN_REGEX = /^(\s*)return\b/;
const ELSE_IF_PREFIX = /^(\s*)\}?\s*else if\s*\(/;
const IF_PREFIX = /^(\s*)\}?\s*if\s*\(/;
const ELSE_PREFIX = /^(\s*)\}?\s*else\b/;
const CASE_REGEX = /^(\s*)case\s+(.+):\s*$/;
const DEFAULT_REGEX = /^(\s*)default\s*:\s*$/;
const GET_PARAM_REGEX = /SNavigation\.getParam\(\s*['"`]([^'"`]+)['"`]/;
const CATCH_PREFIX = /^(\s*)\}?\s*catch\s*\(/;

interface BranchMatch {
  indent: string;
  label: string;
  /** True when the branch body lives on the following line(s) — the log goes right after it. */
  isBlock: boolean;
}

/** Finds the ")" that closes the "(" implicitly opened right before `fromIndex`, honoring nested parens. */
function findMatchingParenEnd(text: string, fromIndex: number): number {
  let depth = 1;
  for (let idx = fromIndex; idx < text.length; idx++) {
    if (text[idx] === '(') {
      depth++;
    } else if (text[idx] === ')') {
      depth--;
      if (depth === 0) {
        return idx;
      }
    }
  }
  return -1;
}

function matchIfLike(text: string, prefixRegex: RegExp): { indent: string; condition: string; rest: string } | undefined {
  const m = text.match(prefixRegex);
  if (!m) {
    return undefined;
  }
  const openIndex = m[0].length;
  const closeIndex = findMatchingParenEnd(text, openIndex);
  if (closeIndex === -1) {
    return undefined;
  }
  return {
    indent: m[1],
    condition: text.slice(openIndex, closeIndex).trim(),
    rest: text.slice(closeIndex + 1).trim()
  };
}

function matchBranch(text: string): BranchMatch | undefined {
  const elseIf = matchIfLike(text, ELSE_IF_PREFIX);
  if (elseIf) {
    return { indent: elseIf.indent, label: `else if (${elseIf.condition})`, isBlock: elseIf.rest === '' || elseIf.rest === '{' };
  }

  const ifLike = matchIfLike(text, IF_PREFIX);
  if (ifLike) {
    return { indent: ifLike.indent, label: `if (${ifLike.condition})`, isBlock: ifLike.rest === '' || ifLike.rest === '{' };
  }

  const elseMatch = text.match(ELSE_PREFIX);
  if (elseMatch) {
    const rest = text.slice(elseMatch[0].length).trim();
    if (!/^if\b/.test(rest)) {
      return { indent: elseMatch[1], label: 'else', isBlock: rest === '' || rest === '{' };
    }
  }

  const caseMatch = text.match(CASE_REGEX);
  if (caseMatch) {
    return { indent: caseMatch[1], label: `case ${caseMatch[2].trim()}`, isBlock: true };
  }

  const defaultMatch = text.match(DEFAULT_REGEX);
  if (defaultMatch) {
    return { indent: defaultMatch[1], label: 'default', isBlock: true };
  }

  return undefined;
}

interface CatchMatch {
  indent: string;
  paramName: string;
  isBlock: boolean;
}

function matchCatch(text: string): CatchMatch | undefined {
  const m = text.match(CATCH_PREFIX);
  if (!m) {
    return undefined;
  }
  const openIndex = m[0].length;
  const closeIndex = findMatchingParenEnd(text, openIndex);
  if (closeIndex === -1) {
    return undefined;
  }
  const inside = text.slice(openIndex, closeIndex).trim();
  if (!inside) {
    return undefined; // "catch {}" with no bound variable — nothing to log.
  }
  const paramName = inside.split(':')[0].trim();
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(paramName)) {
    return undefined; // destructured/complex catch bindings are not handled.
  }
  const rest = text.slice(closeIndex + 1).trim();
  return { indent: m[1], paramName, isBlock: rest === '' || rest === '{' };
}

async function cmdFormatWithConsoles(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Pro Keybindings: no hay ningún editor activo.');
    return;
  }

  const doc = editor.document;
  const fileName = path.basename(doc.fileName);
  const eol = doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';

  // Start from a clean slate: drop every console.* line this tool previously inserted,
  // so re-running always reflects the current shape of the code instead of piling up.
  const isOwnConsoleLine = (line: string): boolean => {
    const t = line.trim();
    return t.startsWith('console.') && t.includes(CONSOLE_MARKER);
  };
  const originalLines = doc.getText().split(/\r\n|\n/);
  const lines = originalLines.filter((line) => !isOwnConsoleLine(line));
  const removedCount = originalLines.length - lines.length;

  const inserts: { targetLine: number; indent: string; statement: string }[] = [];

  /** Places `statement` either right before line `i` (single-line branch) or as the first line of its block. */
  const placeStatement = (i: number, ownIndent: string, isBlock: boolean, statement: string) => {
    if (!isBlock) {
      inserts.push({ targetLine: i, indent: ownIndent, statement });
      return;
    }
    const nextIndex = i + 1;
    if (nextIndex >= lines.length) {
      return;
    }
    const nextText = lines[nextIndex];
    const nextIndent = nextText.slice(0, nextText.length - nextText.trimStart().length);
    if (!nextText.trim() || nextIndent.length <= ownIndent.length) {
      return;
    }
    inserts.push({ targetLine: nextIndex, indent: nextIndent, statement });
  };

  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    const trimmed = text.trimStart();

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      continue;
    }

    const returnMatch = text.match(RETURN_REGEX);
    if (returnMatch) {
      const message = `${CONSOLE_MARKER} ${fileName}:${i + 1} -> render`;
      inserts.push({ targetLine: i, indent: returnMatch[1], statement: `console.log(${JSON.stringify(message)});` });
      continue;
    }

    const catchMatch = matchCatch(text);
    if (catchMatch) {
      const statement = `console.error(${JSON.stringify(`${CONSOLE_MARKER} Error al cargar los datos:`)}, ${catchMatch.paramName});`;
      placeStatement(i, catchMatch.indent, catchMatch.isBlock, statement);
      continue;
    }

    const branch = matchBranch(text);
    if (!branch) {
      continue;
    }

    const getParamMatch = branch.label.match(GET_PARAM_REGEX);
    const statement = getParamMatch
      ? `console.error(${JSON.stringify(`${CONSOLE_MARKER} Error no se encontró el parámetro: ${getParamMatch[1]}`)});`
      : `console.warn(${JSON.stringify(`${CONSOLE_MARKER} ${fileName}:${i + 1} -> ${branch.label}`)});`;

    placeStatement(i, branch.indent, branch.isBlock, statement);
  }

  if (inserts.length === 0 && removedCount === 0) {
    vscode.window.showInformationMessage('Pro Keybindings: no se encontraron "return" ni condiciones para instrumentar.');
    return;
  }

  // Apply from bottom to top so earlier indices stay valid while splicing.
  inserts.sort((a, b) => b.targetLine - a.targetLine);
  for (const ins of inserts) {
    lines.splice(ins.targetLine, 0, `${ins.indent}${ins.statement}`);
  }

  const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length));
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.replace(doc.uri, fullRange, lines.join(eol));
  await vscode.workspace.applyEdit(workspaceEdit);
  vscode.window.showInformationMessage(
    `Pro Keybindings: ${removedCount} console.* anteriores eliminados, ${inserts.length} nuevos agregados.`
  );
}

async function cmdOpenAsNewProject(uri?: vscode.Uri): Promise<void> {
  const target = uri ?? vscode.window.activeTextEditor?.document.uri;
  if (!target) {
    vscode.window.showWarningMessage('Pro Keybindings: no hay ningún archivo o carpeta seleccionado.');
    return;
  }

  let folderPath = target.fsPath;
  try {
    if (!fs.statSync(folderPath).isDirectory()) {
      folderPath = path.dirname(folderPath);
    }
  } catch {
    vscode.window.showWarningMessage('Pro Keybindings: no se pudo acceder a la ruta seleccionada.');
    return;
  }

  await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(folderPath), {
    forceNewWindow: true
  });
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('proKeybindings.detectProjectType', cmdDetectProjectType),
    vscode.commands.registerCommand('proKeybindings.smartRun', cmdSmartRun),
    vscode.commands.registerCommand('proKeybindings.quickCommit', cmdQuickCommit),
    vscode.commands.registerCommand('proKeybindings.openGitHubDesktop', cmdOpenGitHubDesktop),
    vscode.commands.registerCommand('proKeybindings.commitMessagePicker', cmdCommitMessagePicker),
    vscode.commands.registerCommand('proKeybindings.formatWithConsoles', cmdFormatWithConsoles),
    vscode.commands.registerCommand('proKeybindings.openAsNewProject', cmdOpenAsNewProject)
  );
}

export function deactivate(): void {
  sharedTerminal?.dispose();
}
