import { defineExtension } from 'reactive-vscode'
import * as vscode from 'vscode'
import { EnvValueCodeLensProvider } from './codeLensProvider'
import { getDecorations, HIDDEN_DECORATION_TYPE, updateDecorations, VISIBLE_DECORATION_TYPE } from './decorations'
import { isEnvFile, toggleLineVisibility } from './envUtils'
import { getActiveEditor, setActiveEditor, visibleLines } from './state'

const codeLensProvider = new EnvValueCodeLensProvider()

const { activate, deactivate } = defineExtension(() => {
  // Register CodeLens provider for env files
  const codeLensRegistration = vscode.languages.registerCodeLensProvider(
    [
      { scheme: 'file', pattern: '**/.env*' },
      { scheme: 'file', language: 'dotenv' },
      { scheme: 'file', language: 'env' },
    ],
    codeLensProvider,
  )

  // Register global toggle command to hide all values
  const toggleCommand = vscode.commands.registerCommand('kasita-env.toggleValues', () => {
    visibleLines.clear()
    updateDecorations()
    codeLensProvider.refresh()
    vscode.window.showInformationMessage('All values are now hidden')
  })

  // Register line-level toggle command
  const toggleLineCommand = vscode.commands.registerCommand('kasita-env.toggleLine', (uri: string, line: number) => {
    const editor = vscode.window.activeTextEditor
    if (!editor || editor.document.uri.toString() !== uri)
      return

    // Toggle visibility and update decorations for the current line
    toggleLineVisibility(uri, line)

    // Update decorations only for the current editor
    const { hiddenDecorations, visibleDecorations } = getDecorations(editor.document)
    editor.setDecorations(HIDDEN_DECORATION_TYPE, hiddenDecorations)
    editor.setDecorations(VISIBLE_DECORATION_TYPE, visibleDecorations)

    // Refresh CodeLens
    codeLensProvider.refresh()
  })

  // Register document event listeners and disposables
  const subscriptions: vscode.Disposable[] = [
    toggleCommand,
    toggleLineCommand,
    codeLensRegistration,
    HIDDEN_DECORATION_TYPE,
    VISIBLE_DECORATION_TYPE,
  ]

  // Listen for active editor changes
  subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      setActiveEditor(editor)
      if (editor && isEnvFile(editor.document)) {
        updateDecorations()
        codeLensProvider.refresh()
      }
    }),
  )

  // Listen for document content changes
  subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor
      if (editor && event.document === editor.document && isEnvFile(event.document)) {
        updateDecorations()
        codeLensProvider.refresh()
      }
    }),
  )

  // Initialize decorations for the active editor
  setActiveEditor(vscode.window.activeTextEditor)
  const activeEditor = getActiveEditor()
  if (activeEditor && isEnvFile(activeEditor.document)) {
    updateDecorations()
    codeLensProvider.refresh()
  }

  return {
    dispose: () => {
      subscriptions.forEach(d => d.dispose())
    },
  }
})

export { activate, deactivate }
