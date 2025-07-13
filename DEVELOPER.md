# Kasita ENV - Developer Documentation

This document provides an overview for developers interested in understanding, contributing to, or extending the Kasita ENV VS Code extension.

## 1. Introduction

Kasita ENV is a VS Code extension designed to enhance privacy and readability when working with `.env` files by allowing users to hide or show environment variable values. It provides commands and CodeLens integration for seamless interaction.

## 2. Project Structure

The project follows a standard VS Code extension structure with a focus on modularity.

-   `src/`: Contains the core source code for the extension.
    -   `src/index.ts`: The main entry point for the extension, handling activation and deactivation.
    -   `src/state.ts`: Manages the visibility state of lines across different `.env` files.
    -   `src/envUtils.ts`: Utility functions for detecting `.env` files, parsing their content, and managing line visibility.
    -   `src/decorations.ts`: Handles the application and updating of text decorations (hiding/showing values) in the VS Code editor.
    -   `src/codeLensProvider.ts`: Implements the CodeLens feature, providing interactive toggles for individual lines.
    -   `src/config.ts`: Manages extension configurations.
    -   `src/utils.ts`: General utility functions.
    -   `src/generated/`: Contains auto-generated metadata.
-   `test/`: Contains unit and integration tests for the extension.
-   `res/`: Stores static assets like icons and screenshots.
-   `dist/`: Output directory for compiled JavaScript files.
-   `package.json`: Defines the extension's metadata, dependencies, scripts, and VS Code contributions (commands, activation events, etc.).
-   `tsconfig.json`: TypeScript configuration.
-   `eslint.config.mjs`: ESLint configuration for code linting.
-   `pnpm-lock.yaml`, `pnpm-workspace.yaml`: pnpm package manager files.

## 3. Technologies Used

-   **TypeScript**: The primary language for developing the extension.
-   **Node.js**: Runtime environment for VS Code extensions.
-   **VS Code API**: The API provided by VS Code for extending its functionality.
-   **reactive-vscode**: A library used for reactive programming patterns within the VS Code extension context.
-   **tsdown**: A build tool for TypeScript projects.
-   **Vitest**: Testing framework.
-   **ESLint**: Code linting.
-   **pnpm**: Package manager.

## 4. Getting Started (Development Setup)

To set up the development environment:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Whbbit1999/kasita-env.git
    cd kasita-env
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Compile the extension:**
    ```bash
    pnpm run build
    ```
    For continuous compilation during development:
    ```bash
    pnpm run dev
    ```
4.  **Run in VS Code Development Host:**
    -   Open the project in VS Code.
    -   Press `F5` to open a new VS Code window with the extension loaded.
    -   Open any `.env` file to test the extension's functionality.

## 5. Core Concepts

### State Management (`src/state.ts`)

The extension maintains a centralized state for the visibility of lines in `.env` files. This state is crucial for consistently applying decorations and managing CodeLens behavior. It tracks which lines are currently hidden or shown.

### Environment File Utilities (`src/envUtils.ts`)

This module provides functions to:
-   Identify `.env` files (including variations like `.env.local`, `.env.production`).
-   Parse `.env` file content to extract variable names and values.
-   Toggle the visibility state of specific lines or all lines within a document.

### Decorations (`src/decorations.ts`)

VS Code decorations are used to visually hide the environment variable values. This module is responsible for:
-   Creating and managing `TextEditorDecorationType` instances.
-   Applying and updating decorations based on the current visibility state of lines.

### CodeLens (`src/codeLensProvider.ts`)

CodeLens provides contextual actions directly within the editor. For Kasita ENV, it adds a clickable link above each environment variable that allows users to toggle its visibility without using commands.

## 6. Testing

The project uses `Vitest` for testing.

-   **Run all tests:**
    ```bash
    pnpm run test
    ```
-   **Run type checking:**
    ```bash
    pnpm run typecheck
    ```
-   **Run linting:**
    ```bash
    pnpm run lint
    ```

## 7. Building and Packaging

-   **Build for production:**
    ```bash
    pnpm run build
    ```
    This compiles the TypeScript code into JavaScript in the `dist/` directory.

-   **Package the extension (VSIX file):**
    ```bash
    pnpm run pack
    ```
    This creates a `.vsix` file in the project root, which can be installed manually in VS Code.

-   **Publish the extension (requires publisher access):**
    ```bash
    pnpm run publish
    ```

## 8. Contribution

Contributions are welcome! Please feel free to open issues for bug reports or feature requests, or submit pull requests. Ensure your code adheres to the existing style and passes all tests and linting checks.
