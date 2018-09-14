// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { FileExplorer } from './esfexplorer/fileexplorer';

function importEsfFile() {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    openLabel: 'Open',
    filters: {
      'ESF files': ['esf'],
      'All files': ['*']
    }
  };

  vscode.window.showOpenDialog(options).then(fileUri => {
    if (fileUri && fileUri[0]) {
      let file = fileUri[0].fsPath;
      console.log(`Selected file: ${file}`);
    }
  });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Extension "EibPC Editor" is now active!');

  new FileExplorer(context);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let sayHello = vscode.commands.registerCommand('extension.sayHello', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage(
      'This is the EibPC editor. A project by Joerg <is a geek> Krause.'
    );
  });

  // context.subscriptions.push(sayHello);

  let importESF = vscode.commands.registerCommand('extension.importESF', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage(
      'The import was successful. Type "name" sequences to use KNX group address definitions.'
    );

    importEsfFile();
  });

  context.subscriptions.push(importESF);
  console.log('Extension "EibPC Editor" has registered all commands');
}
