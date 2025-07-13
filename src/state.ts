import type * as vscode from 'vscode'

// Store visibility state for each file (uri -> set of visible line numbers)
export const visibleLines = new Map<string, Set<number>>()
let activeEditor: vscode.TextEditor | undefined

export function setActiveEditor(editor: vscode.TextEditor | undefined) {
  activeEditor = editor
}

export function getActiveEditor(): vscode.TextEditor | undefined {
  return activeEditor
}
