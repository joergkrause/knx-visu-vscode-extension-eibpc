import * as vscode from 'vscode';
import { Entry } from "./entry";
import { FileSystemProvider } from './filesystemprovider';

export class FileExplorer {
  private fileExplorer: vscode.TreeView<Entry>;

  constructor(context: vscode.ExtensionContext) {
    const treeDataProvider = new FileSystemProvider();
    this.fileExplorer = vscode.window.createTreeView('esfExplorer', {
      treeDataProvider
    });
    let of = vscode.commands.registerCommand('esfExplorer.openFile', resource =>
      this.openResource(resource)
    );
    context.subscriptions.push(of);
  }

  private openResource(resource: vscode.Uri): void {
    vscode.window.showTextDocument(resource);
  }
}