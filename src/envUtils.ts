import type * as vscode from 'vscode'
import { visibleLines } from './state'

// Check if the document is an environment file
export function isEnvFile(document: vscode.TextDocument): boolean {
  return document.fileName.includes('.env')
    || document.languageId === 'dotenv'
    || document.languageId === 'env'
}

// Get the visibility state of a specific line
export function getLineVisibility(uri: string, line: number): boolean {
  const fileLines = visibleLines.get(uri)
  return fileLines ? fileLines.has(line) : false
}

export function toggleLineVisibility(uri: string, line: number): boolean {
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
