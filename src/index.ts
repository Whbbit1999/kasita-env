import { defineExtension } from 'reactive-vscode'
import * as vscode from 'vscode'

// Decoration type for hidden values
const HIDDEN_DECORATION_TYPE = vscode.window.createTextEditorDecorationType({
  after: {
    contentText: '[Hidden]',
    color: '#666666',
  },
  textDecoration: 'none; display: none',
})

// Decoration type for visible values
const VISIBLE_DECORATION_TYPE = vscode.window.createTextEditorDecorationType({
  textDecoration: 'none',
})

// Check if the document is an environment file
function isEnvFile(document: vscode.TextDocument): boolean {
  return document.fileName.endsWith('.env')
    || document.languageId === 'dotenv'
    || document.languageId === 'env'
}

// Store visibility state for each file (uri -> set of visible line numbers)
const visibleLines = new Map<string, Set<number>>()
let activeEditor: vscode.TextEditor | undefined

// Get the visibility state of a specific line
function getLineVisibility(uri: string, line: number): boolean {
  const fileLines = visibleLines.get(uri)
  return fileLines ? fileLines.has(line) : false
}

function toggleLineVisibility(uri: string, line: number): boolean {
  let fileLines = visibleLines.get(uri)
  if (!fileLines) {
    fileLines = new Set()
    visibleLines.set(uri, fileLines)
  }

  if (fileLines.has(line)) {
    fileLines.delete(line)
    return false
  }
  else {
    fileLines.add(line)
    return true
  }
}

class EnvValueCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>()
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event

  refresh(): void {
    this._onDidChangeCodeLenses.fire()
  }

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    if (!isEnvFile(document)) {
      return []
    }

    const codeLenses: vscode.CodeLens[] = []
    const text = document.getText()
    const lines = text.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const match = line.match(/^([^=]+)=(.+)$/)
      if (match) {
        const range = new vscode.Range(i, 0, i, 0)
        codeLenses.push(new vscode.CodeLens(range, {
          title: '$(eye) Toggle',
          command: 'kasita-env.toggleLine',
          arguments: [document.uri.toString(), i],
        }))
      }
    }

    return codeLenses
  }
}

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

    // 切换当前行的可见性并更新装饰器
    toggleLineVisibility(uri, line)

    // 只更新当前编辑器的装饰器
    const { hiddenDecorations, visibleDecorations } = getDecorations(editor.document)
    editor.setDecorations(HIDDEN_DECORATION_TYPE, hiddenDecorations)
    editor.setDecorations(VISIBLE_DECORATION_TYPE, visibleDecorations)

    // 刷新 CodeLens
    codeLensProvider.refresh()
  })

  function updateDecorations() {
    vscode.window.visibleTextEditors.forEach((editor) => {
      if (isEnvFile(editor.document)) {
        const { hiddenDecorations, visibleDecorations } = getDecorations(editor.document)
        editor.setDecorations(HIDDEN_DECORATION_TYPE, hiddenDecorations)
        editor.setDecorations(VISIBLE_DECORATION_TYPE, visibleDecorations)
      }
    })
  }

  function getDecorations(document: vscode.TextDocument): {
    hiddenDecorations: vscode.DecorationOptions[]
    visibleDecorations: vscode.DecorationOptions[]
  } {
    const text = document.getText()
    const hiddenDecorations: vscode.DecorationOptions[] = []
    const visibleDecorations: vscode.DecorationOptions[] = []

    const lines = text.split('\n')
    lines.forEach((line, index) => {
      const match = line.match(/^([^=]+)=(.+)$/)
      if (match) {
        const valueStart = line.indexOf('=') + 1
        const valueEnd = line.length
        const key = match[1].trim()

        const range = new vscode.Range(
          new vscode.Position(index, valueStart),
          new vscode.Position(index, valueEnd),
        )

        if (getLineVisibility(document.uri.toString(), index)) {
          visibleDecorations.push({ range })
        }
        else {
          hiddenDecorations.push({
            range,
            renderOptions: {
              after: {
                contentText: `[${key}]`,
                color: '#666666',
              },
            },
          })
        }
      }
    })

    return { hiddenDecorations, visibleDecorations }
  }

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
      activeEditor = editor
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
  activeEditor = vscode.window.activeTextEditor
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
