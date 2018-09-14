"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var fs = require("fs");
var FileFunctions = /** @class */ (function () {
    function FileFunctions() {
    }
    FileFunctions.prototype.handleResult = function (resolve, reject, error, result) {
        if (error) {
            reject(this.messageError(error));
        }
        else {
            resolve(result);
        }
    };
    FileFunctions.prototype.messageError = function (error) {
        if (error.code === 'ENOENT') {
            return vscode.FileSystemError.FileNotFound();
        }
        if (error.code === 'EISDIR') {
            return vscode.FileSystemError.FileIsADirectory();
        }
        if (error.code === 'EEXIST') {
            return vscode.FileSystemError.FileExists();
        }
        if (error.code === 'EPERM' || error.code === 'EACCESS') {
            return vscode.FileSystemError.NoPermissions();
        }
        return error;
    };
    FileFunctions.prototype.checkCancellation = function (token) {
        if (token.isCancellationRequested) {
            throw new Error('Operation cancelled');
        }
    };
    FileFunctions.prototype.normalizeNFC = function (items) {
        if (process.platform !== 'darwin') {
            return items;
        }
        if (Array.isArray(items)) {
            return items.map(function (item) { return item.normalize('NFC'); });
        }
        return items.normalize('NFC');
    };
    FileFunctions.prototype.readdir = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.readdir(path, function (error, children) {
                return _this.handleResult(resolve, reject, error, _this.normalizeNFC(children));
            });
        });
    };
    FileFunctions.prototype.stat = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.stat(path, function (error, stat) {
                return _this.handleResult(resolve, reject, error, stat);
            });
        });
    };
    FileFunctions.prototype.readfile = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.readFile(path, function (error, buffer) {
                return _this.handleResult(resolve, reject, error, buffer);
            });
        });
    };
    FileFunctions.prototype.writefile = function (path, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.writeFile(path, content, function (error) {
                return _this.handleResult(resolve, reject, error, void 0);
            });
        });
    };
    FileFunctions.prototype.exists = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.exists(path, function (exists) {
                return _this.handleResult(resolve, reject, null, exists);
            });
        });
    };
    FileFunctions.prototype.rename = function (oldPath, newPath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.rename(oldPath, newPath, function (error) {
                return _this.handleResult(resolve, reject, error, void 0);
            });
        });
    };
    FileFunctions.prototype.unlink = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.unlink(path, function (error) {
                return _this.handleResult(resolve, reject, error, void 0);
            });
        });
    };
    return FileFunctions;
}());
exports.FileFunctions = FileFunctions;
