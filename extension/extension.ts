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
const RETURN_BARE_REGEX = /^\s*return\s*;?\s*$/;
const CONSOLE_LOG_LINE_REGEX = /^\s*console\.log\(.*\)\s*;?\s*$/;
const FUNC_DECL_REGEX = /^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/;
const FUNC_ARROW_REGEX = /^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*(?::[^=]+)?=>\s*\{?\s*$/;
const SUCCESS_NAME_REGEX = /^(load|init|initialize|fetch|create)/i;
const ELSE_IF_PREFIX = /^(\s*)\}?\s*else if\s*\(/;
const IF_PREFIX = /^(\s*)\}?\s*if\s*\(/;
const ELSE_PREFIX = /^(\s*)\}?\s*else\b/;
const CASE_REGEX = /^(\s*)case\s+(.+):\s*$/;
const DEFAULT_REGEX = /^(\s*)default\s*:\s*$/;
const CATCH_PREFIX = /^(\s*)\}?\s*catch\s*\(/;

interface BranchMatch {
  indent: string;
  label: string;
  /** True when the branch body lives on the following line(s) — the log goes right after it. */
  isBlock: boolean;
  /** The statement written inline after the condition, when isBlock is false (e.g. "return;"). */
  singleLineBody?: string;
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
    const isBlock = elseIf.rest === '' || elseIf.rest === '{';
    return { indent: elseIf.indent, label: `else if (${elseIf.condition})`, isBlock, singleLineBody: isBlock ? undefined : elseIf.rest };
  }

  const ifLike = matchIfLike(text, IF_PREFIX);
  if (ifLike) {
    const isBlock = ifLike.rest === '' || ifLike.rest === '{';
    return { indent: ifLike.indent, label: `if (${ifLike.condition})`, isBlock, singleLineBody: isBlock ? undefined : ifLike.rest };
  }

  const elseMatch = text.match(ELSE_PREFIX);
  if (elseMatch) {
    const rest = text.slice(elseMatch[0].length).trim();
    if (!/^if\b/.test(rest)) {
      const isBlock = rest === '' || rest === '{';
      return { indent: elseMatch[1], label: 'else', isBlock, singleLineBody: isBlock ? undefined : rest };
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

interface FuncFrame {
  name: string;
  openDepth: number;
  bodyIndent: string | null;
}

const CODE_FILE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.svelte', '.astro'
]);
/** Any import whose source is exactly 'react'/"react" — protected, never modified. */
const REACT_IMPORT_REGEX = /^\s*import\s.+from\s+['"]react['"]\s*;?\s*$/;
const SWITCH_PREFIX = /^(\s*)switch\s*\(/;
const CONSOLE_DEBUG_LINE_REGEX = /^\s*console\.debug\(.*\)\s*;?\s*$/;
const COMMENTED_CONSOLE_REGEX = /^\s*\/\/\s*console\.(log|debug)\(/;
const IMPORT_LINE_REGEX = /^\s*import\s.+from\s+['"](.+)['"]\s*;?\s*$/;

const indentOf = (s: string) => s.slice(0, s.length - s.trimStart().length);

function findReactImportLines(text: string): string[] {
  return text.split(/\r\n|\n/).filter((l) => REACT_IMPORT_REGEX.test(l));
}

/**
 * Restores every original `from 'react'`/`from "react"` import line verbatim,
 * undoing anything `organizeImports`/`formatDocument` may have done to them
 * (dropping an unused named import, changing quotes, reordering, etc).
 */
async function restoreProtectedReactImports(doc: vscode.TextDocument, originalReactLines: string[]): Promise<void> {
  if (originalReactLines.length === 0) {
    return;
  }
  const currentLines = doc.getText().split(/\r\n|\n/);
  const currentReactIndices = currentLines
    .map((l, idx) => ({ l, idx }))
    .filter(({ l }) => REACT_IMPORT_REGEX.test(l));

  const edit = new vscode.WorkspaceEdit();

  if (currentReactIndices.length === originalReactLines.length) {
    currentReactIndices.forEach(({ idx, l }, i) => {
      if (l !== originalReactLines[i]) {
        edit.replace(doc.uri, doc.lineAt(idx).range, originalReactLines[i]);
      }
    });
  } else {
    // Count diverged (an import got merged/dropped) — reinsert whatever original
    // react import text is missing, right after the last surviving one.
    const missing = originalReactLines.filter((orig) => !currentLines.includes(orig));
    if (missing.length > 0) {
      const anchorIdx = currentReactIndices.length > 0
        ? currentReactIndices[currentReactIndices.length - 1].idx
        : 0;
      const anchorLine = doc.lineAt(Math.min(anchorIdx, doc.lineCount - 1));
      edit.insert(doc.uri, anchorLine.range.end, '\n' + missing.join('\n'));
    }
  }

  if (edit.size > 0) {
    await vscode.workspace.applyEdit(edit);
  }
}

interface ConsoleCleanupResult {
  lines: string[];
  removedCount: number;
  insertedCount: number;
}

/**
 * Standardizes console usage across the given lines:
 * - drops every plain `console.log(...)`/`console.debug(...)` (temporary/debug noise);
 * - guarantees a `console.error("Func: error.", err)` inside every `catch`;
 * - adds `console.warn("Func: descripción.")` before bare early-return guards
 *   and empty if/else/switch branches;
 * - adds `console.info("Func: proceso finalizado correctamente.")` before the
 *   final return of load/init/fetch/create-style functions.
 * Idempotent: lines this tool inserted before are removed first.
 */
function cleanupConsoleLines(originalLines: string[], opts: { dropDebugComments?: boolean } = {}): ConsoleCleanupResult {
  const isOwnConsoleLine = (line: string): boolean => {
    const t = line.trim();
    return t.startsWith('console.') && t.includes(CONSOLE_MARKER);
  };
  let removedCount = 0;
  const lines = originalLines.filter((line) => {
    const drop =
      isOwnConsoleLine(line) ||
      CONSOLE_LOG_LINE_REGEX.test(line) ||
      CONSOLE_DEBUG_LINE_REGEX.test(line) ||
      (opts.dropDebugComments === true && COMMENTED_CONSOLE_REGEX.test(line));
    if (drop) removedCount++;
    return !drop;
  });

  const inserts: { targetLine: number; indent: string; statement: string }[] = [];

  /** Places `statement` either right before line `i` (single-line branch) or as the first line of its block. */
  const placeStatement = (i: number, ownIndent: string, isBlock: boolean, statement: string) => {
    const keyword = statement.split('(')[0];
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
      return; // already has an equivalent console call — avoid a duplicate.
    }
    inserts.push({ targetLine: nextIndex, indent: nextIndent, statement });
  };

  const stack: FuncFrame[] = [];
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

    const current = stack.length ? stack[stack.length - 1] : undefined;
    if (current && current.bodyIndent === null && trimmed && !funcMatch) {
      current.bodyIndent = indentOf(text);
    }

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      continue;
    }

    const funcLabel = current ? current.name : 'archivo';

    const catchMatch = matchCatch(text);
    if (catchMatch) {
      const statement = `console.error(${JSON.stringify(`${CONSOLE_MARKER} ${funcLabel}: error.`)}, ${catchMatch.paramName});`;
      placeStatement(i, catchMatch.indent, catchMatch.isBlock, statement);
      continue;
    }

    if (RETURN_BARE_REGEX.test(text)) {
      const indent = indentOf(text);
      const prevText = lines[i - 1] ?? '';
      if (!prevText.trim().startsWith('console.warn')) {
        const statement = `console.warn(${JSON.stringify(`${CONSOLE_MARKER} ${funcLabel}: condición no cumplida, se cancela.`)});`;
        inserts.push({ targetLine: i, indent, statement });
      }
      continue;
    }

    const returnMatch = text.match(RETURN_REGEX);
    if (returnMatch && current && current.bodyIndent === returnMatch[1] && SUCCESS_NAME_REGEX.test(current.name)) {
      const prevText = lines[i - 1] ?? '';
      if (!prevText.trim().startsWith('console.info')) {
        const statement = `console.info(${JSON.stringify(`${CONSOLE_MARKER} ${current.name}: proceso finalizado correctamente.`)});`;
        inserts.push({ targetLine: i, indent: returnMatch[1], statement });
      }
      continue;
    }

    const branch = matchBranch(text);
    if (!branch) {
      continue;
    }

    if (!branch.isBlock && RETURN_BARE_REGEX.test(branch.singleLineBody ?? '')) {
      const statement = `console.warn(${JSON.stringify(`${CONSOLE_MARKER} ${funcLabel}: ${branch.label} sin motivo indicado.`)});`;
      inserts.push({ targetLine: i, indent: branch.indent, statement });
      continue;
    }

    if (branch.isBlock) {
      const nextText = lines[i + 1] ?? '';
      const nextTrim = nextText.trim();
      const isEmptyBlock = nextTrim === '}' || nextTrim === '';
      const isBareReturnBlock = RETURN_BARE_REGEX.test(nextText);
      if (isEmptyBlock || isBareReturnBlock) {
        const statement = `console.warn(${JSON.stringify(`${CONSOLE_MARKER} ${funcLabel}: ${branch.label} sin motivo indicado.`)});`;
        placeStatement(i, branch.indent, true, statement);
      }
    }
  }

  // Apply from bottom to top so earlier indices stay valid while splicing.
  inserts.sort((a, b) => b.targetLine - a.targetLine);
  for (const ins of inserts) {
    lines.splice(ins.targetLine, 0, `${ins.indent}${ins.statement}`);
  }

  return { lines, removedCount, insertedCount: inserts.length };
}

/** Strips trailing whitespace and collapses runs of blank lines down to a single one. */
function trimAndCollapseBlankLines(lines: string[]): string[] {
  const trimmed = lines.map((line) => line.replace(/[ \t]+$/, ''));
  const collapsed: string[] = [];
  for (const line of trimmed) {
    if (line === '' && collapsed[collapsed.length - 1] === '') {
      continue;
    }
    collapsed.push(line);
  }
  return collapsed;
}

/** Adds a `default:` case with a console.warn to switch statements that don't have one. */
function addMissingSwitchDefaults(lines: string[]): { lines: string[]; addedCount: number } {
  const inserts: { targetLine: number; indent: string; statement: string }[] = [];

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
    const funcNameMatch = lines
      .slice(0, i)
      .reverse()
      .map((l) => l.match(FUNC_DECL_REGEX) || l.match(FUNC_ARROW_REGEX))
      .find(Boolean);
    const funcLabel = funcNameMatch ? funcNameMatch[1] : 'archivo';
    inserts.push({
      targetLine: closeIndex,
      indent: caseIndent,
      statement: `default:\n${caseIndent}  console.warn(${JSON.stringify(`${CONSOLE_MARKER} Caso no controlado en ${funcLabel}.`)});\n${caseIndent}  break;`
    });
  }

  inserts.sort((a, b) => b.targetLine - a.targetLine);
  const result = [...lines];
  for (const ins of inserts) {
    result.splice(ins.targetLine, 0, `${ins.indent}${ins.statement}`);
  }
  return { lines: result, addedCount: inserts.length };
}

/**
 * Regroups the leading import block into external / internal (`@/...`) / relative (`./`, `../`)
 * sections separated by a single blank line, preserving each import's original relative order
 * within its group. Any import from 'react'/"react" is protected code: it's never sorted,
 * reordered, or merged with anything — each one stays pinned exactly where it was, splitting
 * the sortable block around it.
 */
function organizeImportGroups(lines: string[]): { lines: string[]; changed: boolean } {
  let end = 0;
  while (end < lines.length) {
    const t = lines[end].trim();
    if (t === '' || IMPORT_LINE_REGEX.test(lines[end]) || t.startsWith('//') || REACT_IMPORT_REGEX.test(lines[end])) {
      end++;
      continue;
    }
    break;
  }
  if (end === 0) {
    return { lines, changed: false };
  }

  const head = lines.slice(0, end);

  const sortSegment = (segment: string[]): string[] => {
    const external: string[] = [];
    const internal: string[] = [];
    const relative: string[] = [];
    for (const line of segment) {
      if (!line.trim()) continue;
      const m = line.match(IMPORT_LINE_REGEX);
      if (!m) continue;
      const spec = m[1];
      if (spec.startsWith('.')) relative.push(line);
      else if (spec.startsWith('@/') || spec.startsWith('~/')) internal.push(line);
      else external.push(line);
    }
    const groups = [external, internal, relative].filter((g) => g.length > 0);
    return groups.map((g) => g.join('\n')).join('\n\n').split('\n');
  };

  // Split the head on every protected react-import line, sort each in-between
  // chunk on its own, and stitch everything back together around the pins.
  const newHeadParts: string[] = [];
  let chunkStart = 0;
  for (let i = 0; i <= head.length; i++) {
    const isPin = i < head.length && REACT_IMPORT_REGEX.test(head[i]);
    if (isPin || i === head.length) {
      const chunk = sortSegment(head.slice(chunkStart, i));
      if (chunk.length > 0 && chunk.some((l) => l.trim())) {
        if (newHeadParts.length > 0) newHeadParts.push('');
        newHeadParts.push(...chunk);
      }
      if (isPin) {
        if (newHeadParts.length > 0) newHeadParts.push('');
        newHeadParts.push(head[i]);
      }
      chunkStart = i + 1;
    }
  }

  const changed = newHeadParts.join('\n') !== head.join('\n');
  return { lines: [...newHeadParts, ...lines.slice(end)], changed };
}

async function cmdFormatWithConsoles(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Pro Keybindings: no hay ningún editor activo.');
    return;
  }

  const doc = editor.document;
  if (!CODE_FILE_EXTENSIONS.has(path.extname(doc.fileName).toLowerCase())) {
    vscode.window.showWarningMessage('Pro Keybindings: este comando solo funciona en archivos .ts/.tsx/.js/.jsx/.mjs/.cjs/.vue/.svelte/.astro.');
    return;
  }
  const eol = doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
  const originalReactLines = findReactImportLines(doc.getText());

  const originalLines = doc.getText().split(/\r\n|\n/);
  const { lines, removedCount, insertedCount } = cleanupConsoleLines(originalLines);
  const collapsedLines = trimAndCollapseBlankLines(lines);

  const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length));
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.replace(doc.uri, fullRange, collapsedLines.join(eol));
  await vscode.workspace.applyEdit(workspaceEdit);

  // Let the language's own formatter fix indentation/brace alignment, and organize
  // (drop unused) imports — far more reliable than reimplementing a formatter by hand.
  try {
    await vscode.commands.executeCommand('editor.action.organizeImports');
  } catch {
    // No import-organizing provider for this language — nothing to do.
  }
  try {
    await vscode.commands.executeCommand('editor.action.formatDocument');
  } catch {
    // No formatter registered/installed for this language — leave indentation as-is.
  }
  await restoreProtectedReactImports(doc, originalReactLines);

  vscode.window.showInformationMessage(
    `Pro Keybindings: ${removedCount} console.log eliminados, ${insertedCount} console.error/warn/info agregados, archivo formateado.`
  );
}

/**
 * "⚡ Super" (F12) — a heavier pass on top of "♻️ Limpiar consolas": also fills in
 * missing `switch` defaults, drops commented-out console.* leftovers, and regroups
 * imports (external / internal / relative). Every import from 'react'/"react" is
 * protected code: never sorted, reordered, reformatted, or pruned as "unused".
 * Never touches variable/parameter/dead-code removal — that's left to the
 * project's own linter, since a regex-based pass can't safely tell "unused"
 * from "used indirectly" without breaking behavior.
 */
async function cmdSuperClean(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Pro Keybindings: no hay ningún editor activo.');
    return;
  }

  const doc = editor.document;
  if (!CODE_FILE_EXTENSIONS.has(path.extname(doc.fileName).toLowerCase())) {
    vscode.window.showWarningMessage('Pro Keybindings: este comando solo funciona en archivos .ts/.tsx/.js/.jsx/.mjs/.cjs/.vue/.svelte/.astro.');
    return;
  }
  const eol = doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
  const originalReactLines = findReactImportLines(doc.getText());

  const originalLines = doc.getText().split(/\r\n|\n/);
  const { lines: consoleLines, removedCount, insertedCount } = cleanupConsoleLines(originalLines, { dropDebugComments: true });
  const { lines: withDefaults, addedCount: defaultsAdded } = addMissingSwitchDefaults(consoleLines);
  const { lines: withImports, changed: importsRegrouped } = organizeImportGroups(withDefaults);
  const collapsedLines = trimAndCollapseBlankLines(withImports);

  const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length));
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.replace(doc.uri, fullRange, collapsedLines.join(eol));
  await vscode.workspace.applyEdit(workspaceEdit);

  try {
    await vscode.commands.executeCommand('editor.action.organizeImports');
  } catch {
    // No import-organizing provider for this language — nothing to do.
  }
  try {
    await vscode.commands.executeCommand('editor.action.addMissingImports');
  } catch {
    // No import-adding provider for this language — nothing to do.
  }
  try {
    await vscode.commands.executeCommand('editor.action.formatDocument');
  } catch {
    // No formatter registered/installed for this language — leave indentation as-is.
  }
  await restoreProtectedReactImports(doc, originalReactLines);

  vscode.window.showInformationMessage(
    `Pro Keybindings ⚡ Super: ${removedCount} console.log/debug eliminados, ${insertedCount} console.error/warn/info agregados, ` +
      `${defaultsAdded} default agregados a switch, imports ${importsRegrouped ? 'reagrupados' : 'sin cambios'}, importaciones faltantes agregadas, archivo formateado.`
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

async function cmdOpenSelectedFolderInNewWindow(): Promise<void> {
  const previousClipboard = await vscode.env.clipboard.readText();

  // "copyFilePath" internamente lee la selección actual del Explorador,
  // algo que la API pública de extensiones no expone directamente.
  await vscode.commands.executeCommand('copyFilePath');
  const copiedPath = (await vscode.env.clipboard.readText()).split(/\r?\n/)[0].trim();

  await vscode.env.clipboard.writeText(previousClipboard);

  if (!copiedPath) {
    vscode.window.showWarningMessage('Pro Keybindings: no hay ninguna carpeta seleccionada en el Explorador.');
    return;
  }

  await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(copiedPath), {
    forceNewWindow: true
  });
}

async function cmdCleanupProjectImports(): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('Pro Keybindings: no hay ninguna carpeta de proyecto abierta.');
    return;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const files: vscode.Uri[] = [];

  const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.svelte', '.astro'];

  const findFiles = async (dir: string): Promise<void> => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') {
          continue;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await findFiles(fullPath);
        } else if (codeExtensions.some(ext => entry.name.endsWith(ext))) {
          files.push(vscode.Uri.file(fullPath));
        }
      }
    } catch {
      // skip on error
    }
  };

  await findFiles(rootPath);

  if (files.length === 0) {
    vscode.window.showWarningMessage('Pro Keybindings: no se encontraron archivos de código.');
    return;
  }

  let processed = 0;
  for (const fileUri of files) {
    try {
      const doc = await vscode.workspace.openTextDocument(fileUri);
      const editor = await vscode.window.showTextDocument(doc, { preview: true });

      const originalReactLines = findReactImportLines(doc.getText());

      try {
        await vscode.commands.executeCommand('editor.action.organizeImports');
      } catch {
        // No import-organizing provider
      }
      try {
        await vscode.commands.executeCommand('editor.action.formatDocument');
      } catch {
        // No formatter
      }

      await restoreProtectedReactImports(doc, originalReactLines);

      if (doc.isDirty) {
        await doc.save();
        processed++;
      }

      await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    } catch (err: any) {
      console.error(`Error procesando ${fileUri.fsPath}:`, err?.message);
    }
  }

  vscode.window.showInformationMessage(
    `Pro Keybindings: ${processed} archivos procesados, importaciones organizadas en todo el proyecto.`
  );
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('proKeybindings.detectProjectType', cmdDetectProjectType),
    vscode.commands.registerCommand('proKeybindings.smartRun', cmdSmartRun),
    vscode.commands.registerCommand('proKeybindings.quickCommit', cmdQuickCommit),
    vscode.commands.registerCommand('proKeybindings.openGitHubDesktop', cmdOpenGitHubDesktop),
    vscode.commands.registerCommand('proKeybindings.commitMessagePicker', cmdCommitMessagePicker),
    vscode.commands.registerCommand('proKeybindings.formatWithConsoles', cmdFormatWithConsoles),
    vscode.commands.registerCommand('proKeybindings.superClean', cmdSuperClean),
    vscode.commands.registerCommand('proKeybindings.openAsNewProject', cmdOpenAsNewProject),
    vscode.commands.registerCommand('proKeybindings.openSelectedFolderInNewWindow', cmdOpenSelectedFolderInNewWindow),
    vscode.commands.registerCommand('proKeybindings.cleanupProjectImports', cmdCleanupProjectImports)
  );
}

export function deactivate(): void {
  sharedTerminal?.dispose();
}
