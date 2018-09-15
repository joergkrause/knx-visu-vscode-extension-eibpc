import * as vscode from 'vscode';
import { Entry } from "./entry";
import { FileSystemProvider } from './filesystemprovider';

export class EsfExplorer {
  private esfExplorer: vscode.TreeView<Entry>;

  constructor(context: vscode.ExtensionContext) {
    // the explorer registers itself and adds its commands
    let of = vscode.commands.registerCommand('esfExplorer.openFile', resource =>
      this.openResource(resource)
    );
    context.subscriptions.push(of);
  }

  private openResource(resource: vscode.Uri): void {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: 'Open',
      defaultUri: resource,
      filters: {
        'ESF files': ['esf'],
        'All files': ['*']
      }
    };
  
    vscode.window.showOpenDialog(options).then(fileUri => {
      if (fileUri && fileUri[0]) {
        let file = fileUri[0].fsPath;
        console.log(`Selected file: ${file}`);
        // read the CSV and pump the values to tree view
        const treeDataProvider = new FileSystemProvider(file);
        // esfExplorer is the target view we send these data to
        this.esfExplorer = vscode.window.createTreeView('esfExplorer', {
          treeDataProvider
        });            
        // Display a message box to the user
        vscode.window.showInformationMessage(`The import of ${file} was successful.`);
      }
    });
  
  }
}

