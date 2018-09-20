"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
var esfexplorer_1 = require("./esfexplorer/esfexplorer");
var nconfprovider_1 = require("./nconfdata/nconfprovider");
var epcparser_1 = require("./epcparser/epcparser");
var vscode_1 = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Extension "EibPC Editor" is now active!');
    // providers registers itself
    new esfexplorer_1.EsfExplorer(context);
    new nconfprovider_1.NconfProvider(context);
    new epcparser_1.EpcParser(context);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('This is the EibPC editor. A project by Joerg <is a geek> Krause.');
    });
    vscode.commands.registerCommand('esfExplorer.writeToBus', function (res) {
        var options = {
            prompt: "Write a value to the address " + res,
            placeHolder: '(1|0|ON|OFF)'
        };
        vscode_1.window.showInputBox(options).then(function (value) {
            if (!value)
                return;
            // show the next dialog, etc.
            vscode.window.showInformationMessage(value);
        });
    });
    console.log('Extension "EibPC Editor" has registered all commands');
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map