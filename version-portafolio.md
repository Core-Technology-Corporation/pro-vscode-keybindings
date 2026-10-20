# Pro VSCode Keybindings

## Descripción breve (tarjeta)

Extensión de VS Code que agrega atajos de teclado para tareas de productividad y comandos inteligentes: correr el proyecto según su tipo, hacer commits con Conventional Commits y limpiar el código en un paso.

## Descripción completa

Pro VSCode Keybindings combina dos capas:

1. **Un keymap declarativo**: unos 25 atajos para edición, terminal, explorador, Git y depuración. Se mantienen en archivos JSON por categoría y un script los compila y valida antes de publicar.
2. **Una extensión TypeScript** con 10 comandos propios:
   - **Smart Run** (`Ctrl+F12`): detecta el tipo de proyecto (React, React Native, Java, HTML, extensión de VS Code, entre otros) y ofrece la forma correcta de ejecutarlo.
   - **Commit Message Picker** (`Ctrl+F9`) y **Quick Commit** (`Ctrl+F8`).
   - **Abrir en GitHub Desktop** (`Ctrl+F10`).
   - **♻️ Limpiar consolas** y **⚡ Super**: estandarizan el logging, agregan `console.error` en los `catch`, completan los `switch` con `default:`, reagrupan los imports y protegen los imports de React.
   - **Limpiar importaciones en todo el proyecto**.

## Problema que resuelve

VS Code trae atajos genéricos, y las tareas repetitivas (ejecutar el proyecto, hacer commit con un formato consistente, quitar logs de depuración, ordenar imports) requieren varios pasos o extensiones separadas.

## Objetivo

Reducir esas tareas a una tecla, sin configuración, con el mismo comportamiento en Windows, Linux y macOS.

## Público objetivo

Desarrolladores web y móviles (JavaScript/TypeScript, React, React Native) que usan VS Code y Git a diario.

## Mi participación técnica

Confirmado por el historial de git: autor de los 58 commits del repositorio (2026-07-09 → 2026-08-12) y desarrollador y mantenedor único según el README. Eso incluye el diseño del keymap, el script de build con validación, la lógica de la extensión y los scripts de publicación.

## Funcionalidades destacadas

- Keymap modular (`src/*.json`) con validación de teclas duplicadas en el build.
- Smart Run con detección del tipo de proyecto.
- Flujo de commits con menú numerado de Conventional Commits, más commit y push.
- ⚡ Super y Limpiar consolas: limpieza de código idempotente; antes de reinstrumentar, borra los mensajes que insertó en la ejecución anterior.
- Integración con los menús contextuales del editor y del Explorador.
- Sin telemetría, según su política de privacidad.

## Tecnologías

| Categoría | Tecnologías |
|---|---|
| Lenguaje | TypeScript 5.5 |
| Plataforma | API de extensiones de VS Code (^1.93) |
| Build | esbuild 0.24 (bundle CJS, Node 18), script Node propio para los keybindings |
| Publicación | vsce, scripts PowerShell y Bash |
| Integraciones | Git, GitHub Desktop, terminal integrada, Live Server, formateadores nativos de VS Code |

## Arquitectura y aspectos técnicos

- Una sola fuente de verdad (`src/*.json`) genera `contributes.keybindings` en `package.json` y `dist/keybindings.json`, porque VS Code solo lee los keybindings desde `package.json`.
- Atajos contextuales con cláusulas `when`. Por ejemplo, `Ctrl+F5` ejecuta SQL en archivos `.sql` y recarga la ventana en el resto, y `F12` solo se reasigna en archivos JS/TS/Vue/Svelte/Astro.
- La limpieza combina transformaciones de texto propias con `editor.action.formatDocument` y `editor.action.organizeImports`, en lugar de implementar un formateador nuevo.

## Seguridad

- No hace llamadas de red: no se encontraron URLs ni llamadas HTTP en `extension/extension.ts`.
- `Ctrl+F9` hace push sin pedir confirmación; el README lo advierte de forma explícita.

## Retos técnicos

- Manipular código fuente sin un parser completo y sin cambiar la lógica.
- Leer la selección del Explorador, que la API no expone; se resolvió con `copyFilePath`.
- Evitar conflictos con los atajos nativos usando cláusulas `when` específicas.

## Mejoras futuras recomendadas

- Corregir ⚡ Super con JSX: en la prueba para la captura dejó `style={{ ... } >` y `</ div>`.
- Usar un parser (TypeScript Compiler API o Babel) para las transformaciones de código.
- Agregar pruebas automatizadas con casos de JSX y TSX.
- Ordenar el CHANGELOG y agregar la entrada de `1.0.11`.

## Estado

Publicada en el Visual Studio Code Marketplace, según los enlaces del README. Versión `1.0.11` en `package.json`.

## Capturas

| Archivo | Contenido |
|---|---|
| `presentacion/01-vista-principal.png` | Editor de atajos de VS Code filtrado por `proKeybindings`: comandos, teclas, condiciones `when` y origen. |
| `presentacion/02-funcionalidad-principal.png` | Resultado real de **⚡ Super** sobre un componente React de prueba: imports reagrupados, logs eliminados, `default:` agregado y notificación con el resumen. También se ve el defecto en el JSX. |
| `presentacion/03-funcionalidad-complementaria.png` | Selector de **Smart Run** (`Ctrl+F12`) con las opciones HTML, React, Java, React Native y Extension. |

Todas las capturas son de la extensión ejecutándose en un *Extension Development Host* de VS Code, sobre una copia del repositorio.
