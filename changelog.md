## [Unreleased]

### New: Modular Architecture for Environment File Handling

This release introduces a significant refactoring of how environment file visibility and decorations are managed within the extension. The previous tightly coupled logic has been reorganized into a new modular architecture, enhancing code readability, maintainability, and extensibility.

**Key changes include:**
*   **`src/state.ts`**: Centralized state management for line visibility across files.
*   **`src/envUtils.ts`**: Dedicated utility functions for environment file detection and line visibility toggling.
*   **`src/decorations.ts`**: Isolated logic for applying and updating VS Code editor decorations based on line visibility.
*   **`src/codeLensProvider.ts`**: Provides CodeLens for environment variables, allowing quick toggling of visibility.

This modular approach makes it easier to understand, debug, and extend the functionality related to environment file handling, contributing to a more robust and maintainable codebase.

### Changed
- Improved `isEnvFile` logic to recognize files like `.env.local`, `.env.production`, etc., in addition to `.env`.
