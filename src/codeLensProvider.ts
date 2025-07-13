import * as vscode from 'vscode'
import { isEnvFile } from './envUtils'

export class EnvValueCodeLensProvider implements vscode.CodeLensProvider {
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
