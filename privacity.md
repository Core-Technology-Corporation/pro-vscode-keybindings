# 🔒 Política de Privacidad

*[🌐 English](privacity.en.md)*

**Pro VSCode Keybindings** no recolecta, almacena ni transmite ningún dato personal o de uso.

## Qué hace la extensión

- Registra atajos de teclado y comandos que se ejecutan **localmente**, dentro de tu instancia de VS Code.
- Los comandos inteligentes (detectar tipo de proyecto, commit, push, abrir en GitHub Desktop, etc.) interactúan únicamente con tu sistema de archivos y con `git`/GitHub Desktop instalados en tu máquina.

## Qué NO hace

- No envía datos a servidores externos.
- No usa analytics ni telemetría.
- No accede a Internet salvo las operaciones normales de `git push`/`git pull` que vos mismo iniciás con tus propias credenciales.
- No lee ni recolecta el contenido de tus archivos más allá de lo necesario para ejecutar el comando que invocaste (por ejemplo, insertar un `console.log` al usar "Formatear con consoles").

## Permisos

La extensión usa únicamente las APIs estándar de VS Code para ejecutar comandos, leer el árbol de archivos del explorador y abrir una terminal. No solicita permisos adicionales del sistema operativo.

## Contacto

Si tenés dudas sobre esta política, abrí un issue en el [repositorio de GitHub](https://github.com/alvarosiles/pro-vscode-keybindings/issues).

## Licencia

MIT License
