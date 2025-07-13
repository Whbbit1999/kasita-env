# Kasita ENV

<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

A VS Code extension to hide/show environment variable values in `.env` files, enhancing privacy and readability when working with sensitive information.

<p align="center">
  <img src="https://raw.githubusercontent.com/Whbbit1999/kasita-env/refs/heads/main/res/kasita-env.png" width=75%>
</p>

## Features

*   **Toggle All Values**: Quickly hide or show all environment variable values in an open `.env` file with a single command.
*   **Toggle Line Value**: Individually toggle the visibility of a specific environment variable on a line-by-line basis.
*   **CodeLens Integration**: Seamlessly toggle individual line visibility directly from the editor using CodeLens.
*   **Support for various .env files**: Recognizes and works with `.env`, `.env.local`, `.env.development`, `.env.production`, and other similar environment files.

## Installation

1.  Open VS Code.
2.  Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3.  Search for "Kasita ENV".
4.  Click "Install".

## Usage

Once installed, the extension automatically activates when you open a `.env` file.

### Commands

You can access the following commands from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

| Command                   | Title                            | Description                                                              |
| :------------------------ | :------------------------------- | :----------------------------------------------------------------------- |
| `kasita-env.toggleValues` | Toggle All ENV Values Visibility | Hides or shows all environment variable values in the active `.env` file. |
| `kasita-env.toggleLine`   | Toggle Line Value Visibility     | Hides or shows the environment variable value on the current line.       |

### CodeLens

For individual lines, a CodeLens will appear above each environment variable. Clicking on this CodeLens will toggle the visibility of that specific line's value.

## Configurations

<!-- configs -->

**No data**

<!-- configs -->

## License

[MIT](./LICENSE.md) License © 2025 [Whbbit1999](https://github.com/Whbbit1999)