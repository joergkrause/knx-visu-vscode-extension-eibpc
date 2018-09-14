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
        vscode.window.showTextDocument(resource);
    };
    return FileExplorer;
}());
exports.FileExplorer = FileExplorer;
