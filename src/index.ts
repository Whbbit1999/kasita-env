import { defineExtension } from 'reactive-vscode'
import * as vscode from 'vscode'

const HIDDEN_DECORATION_TYPE = vscode.window.createTextEditorDecorationType({
  after: {
    contentText: '[Value]',
    color: '#666666',
  },
  textDecoration: 'none; display: none',
})

let isHidden = true
let activeEditor: vscode.TextEditor | undefined
let activePosition: vscode.Position | undefined

const { activate, deactivate } = defineExtension(() => {
  const toggleCommand = vscode.commands.registerCommand('kasita-env.toggleValues', () => {
    isHidden = !isHidden
    updateDecorations()
    vscode.window.showInformationMessage(`ENV values are now ${isHidden ? 'hidden' : 'visible'}`)
  })

  function updateDecorations() {
    vscode.window.visibleTextEditors.forEach((editor) => {
      if (isEnvFile(editor.document)) {
        const decorations = getDecorations(editor.document)
        const hiddenDecorations = decorations.filter(d =>
          !activePosition || d.range.start.line !== activePosition.line,
        )
        editor.setDecorations(HIDDEN_DECORATION_TYPE, isHidden ? hiddenDecorations : [])
      }
    })
  }

  function isEnvFile(document: vscode.TextDocument): boolean {
    return document.fileName.endsWith('.env')
      || document.languageId === 'dotenv'
      || document.languageId === 'env'
  }

  // Get decorations for variable values that need to be hidden
  function getDecorations(document: vscode.TextDocument): vscode.DecorationOptions[] {
    const text = document.getText()
    const decorations: vscode.DecorationOptions[] = []

    const lines = text.split('\n')
    lines.forEach((line, index) => {
      const match = line.match(/^([^=]+)=(.+)$/)
      if (match) {
        const valueStart = line.indexOf('=') + 1
        const valueEnd = line.length
        const contentText = line.split('=')[0]
        decorations.push({
          range: new vscode.Range(
            new vscode.Position(index, valueStart),
            new vscode.Position(index, valueEnd),
          ),
          renderOptions: {
            after: {
              contentText: `[${contentText}]`,
            },
          },
        })
      }
    })

    return decorations
  }

  const subscriptions: vscode.Disposable[] = []

  subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      activeEditor = editor
      if (editor && isEnvFile(editor.document)) {
        updateDecorations()
      }
    }),
  )

  subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor
      if (editor && event.document === editor.document && isEnvFile(event.document)) {
        updateDecorations()
      }
    }),
  )

  subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((event) => {
      if (event.textEditor === activeEditor && isEnvFile(event.textEditor.document)) {
        const position = event.selections[0].active
        activePosition = position
        updateDecorations()
      }
    }),
  )

  activeEditor = vscode.window.activeTextEditor
  if (activeEditor && isEnvFile(activeEditor.document)) {
    updateDecorations()
  }

  return {
    dispose: () => {
      toggleCommand.dispose()
      HIDDEN_DECORATION_TYPE.dispose()
      subscriptions.forEach(d => d.dispose())
    },
  }
})

export { activate, deactivate }
