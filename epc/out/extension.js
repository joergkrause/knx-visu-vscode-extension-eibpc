"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
function openEpcFile() {
    var options = {
        canSelectMany: false,
        openLabel: 'Open',
        filters: {
            'EPC files': ['epc'],
            'All files': ['*']
        }
    };
    vscode.window.showOpenDialog(options).then(function (fileUri) {
        if (fileUri && fileUri[0]) {
            console.log('Selected file: ' + fileUri[0].fsPath);
        }
    });
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Extension "EibPC Editor" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var sayHello = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('This is the EibPC editor in Visual Studio Code. A project by Joerg <is a geek> Krause.');
    });
    context.subscriptions.push(sayHello);
    var importEPC = vscode.commands.registerCommand('extension.importEPC', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('The import was successful. Type "name" sequences to use KNX group address definitions.');
        openEpcFile();
    });
    context.subscriptions.push(importEPC);
}
exports.activate = activate;
