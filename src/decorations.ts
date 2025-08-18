import * as vscode from 'vscode'
import { getLineVisibility, isEnvFile } from './envUtils'

// Decoration type for hidden values
export const HIDDEN_DECORATION_TYPE = vscode.window.createTextEditorDecorationType({
  after: {
    contentText: '[Hidden]',
    color: '#c83e3eff',
  },
  textDecoration: 'none; display: none',
})

// Decoration type for visible values
export const VISIBLE_DECORATION_TYPE = vscode.window.createTextEditorDecorationType({
  textDecoration: 'none',
})

export function updateDecorations() {
  vscode.window.visibleTextEditors.forEach((editor) => {
    if (isEnvFile(editor.document)) {
      const { hiddenDecorations, visibleDecorations } = getDecorations(editor.document)
      // Clear all existing decorations
      editor.setDecorations(HIDDEN_DECORATION_TYPE, [])
      editor.setDecorations(VISIBLE_DECORATION_TYPE, [])
      // Apply new decorations
      editor.setDecorations(HIDDEN_DECORATION_TYPE, hiddenDecorations)
      editor.setDecorations(VISIBLE_DECORATION_TYPE, visibleDecorations)
    }
  })
}

export function getDecorations(document: vscode.TextDocument): {
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
