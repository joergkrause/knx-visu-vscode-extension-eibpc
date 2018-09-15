"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var filesystemprovider_1 = require("./filesystemprovider");
var FileExplorer = /** @class */ (function () {
    function FileExplorer(context) {
        var _this = this;
        var treeDataProvider = new filesystemprovider_1.FileSystemProvider();
        this.fileExplorer = vscode.window.createTreeView('esfExplorer', {
            treeDataProvider: treeDataProvider
        });
        var of = vscode.commands.registerCommand('esfExplorer.openFile', function (resource) {
            return _this.openResource(resource);
        });
        context.subscriptions.push(of);
    }
    FileExplorer.prototype.openResource = function (resource) {
        var options = {
            canSelectMany: false,
            openLabel: 'Open',
            defaultUri: resource,
            filters: {
                'ESF files': ['esf'],
                'All files': ['*']
            }
        };
        vscode.window.showOpenDialog(options).then(function (fileUri) {
            if (fileUri && fileUri[0]) {
                var file = fileUri[0].fsPath;
                console.log("Selected file: " + file);
                // read the CSV and pump the values to tree view
                // Display a message box to the user
                vscode.window.showInformationMessage("The import of " + file + " was successful.");
            }
        });
    };
    return FileExplorer;
}());
exports.FileExplorer = FileExplorer;
