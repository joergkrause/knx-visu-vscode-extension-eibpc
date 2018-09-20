// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { EsfExplorer } from './esfexplorer/esfexplorer';
import { NconfProvider } from './nconfdata/nconfprovider';
import { EpcParser } from './epcparser/epcparser';
import { InputBoxOptions, window } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Extension "EibPC Editor" is now active!');

  // providers registers itself
  new EsfExplorer(context);
  new NconfProvider(context);
  new EpcParser(context);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  vscode.commands.registerCommand('extension.sayHello', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage(
      'This is the EibPC editor. A project by Joerg <is a geek> Krause.'
    );
  });
  vscode.commands.registerCommand('esfExplorer.writeToBus', (res) => {
    let options: InputBoxOptions = {
      prompt: `Write to ${res.name} (${res.fullname})`,
      placeHolder: '(1|0|ON|OFF)'
    };
  
    window.showInputBox(options).then(value => {
      if (!value) return;
      // show the next dialog, etc.
      // nconf -o 686 01 192.168.0.12 (1/1/11)
      vscode.window.showInformationMessage(value);
    });
  });

  console.log('Extension "EibPC Editor" has registered all commands');
}
