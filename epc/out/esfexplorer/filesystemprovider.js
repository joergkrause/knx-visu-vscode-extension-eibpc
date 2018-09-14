"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var path = require("path");
var fs = require("fs");
var filestat_1 = require("./filestat");
var filefunctions_1 = require("./filefunctions");
var FileSystemProvider = /** @class */ (function () {
    function FileSystemProvider() {
        this._onDidChangeFile = new vscode.EventEmitter();
        this._fileFunctions = new filefunctions_1.FileFunctions();
    }
    FileSystemProvider.prototype.createDirectory = function (uri) {
        throw new Error('Method not implemented.');
    };
    FileSystemProvider.prototype.writeFile = function (uri, content, options) {
        throw new Error('Method not implemented.');
    };
    FileSystemProvider.prototype.delete = function (uri, options) {
        throw new Error('Method not implemented.');
    };
    FileSystemProvider.prototype.rename = function (oldUri, newUri, options) {
        throw new Error('Method not implemented.');
    };
    FileSystemProvider.prototype.copy = function (source, destination, options) {
        throw new Error('Method not implemented.');
    };
    FileSystemProvider.prototype.getParent = function (element) {
        throw new Error('Method not implemented.');
    };
    Object.defineProperty(FileSystemProvider.prototype, "onDidChangeFile", {
        get: function () {
            return this._onDidChangeFile.event;
        },
        enumerable: true,
        configurable: true
    });
    FileSystemProvider.prototype.watch = function (uri, options) {
        var _this = this;
        var watcher = fs.watch(uri.fsPath, { recursive: options.recursive }, function (event, filename) { return __awaiter(_this, void 0, void 0, function () {
            var filepath, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        filepath = path.join(uri.fsPath, this._fileFunctions.normalizeNFC(filename.toString()));
                        // TODO support excludes (using minimatch library?)
                        _b = (_a = this._onDidChangeFile).fire;
                        _c = {};
                        if (!(event === 'change')) return [3 /*break*/, 1];
                        _d = vscode.FileChangeType.Changed;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this._fileFunctions.exists(filepath)];
                    case 2:
                        _d = (_e.sent())
                            ? vscode.FileChangeType.Created
                            : vscode.FileChangeType.Deleted;
                        _e.label = 3;
                    case 3:
                        // TODO support excludes (using minimatch library?)
                        _b.apply(_a, [[
                                (_c.type = _d,
                                    _c.uri = uri.with({ path: filepath }),
                                    _c)
                            ]]);
                        return [2 /*return*/];
                }
            });
        }); });
        return { dispose: function () { return watcher.close(); } };
    };
    FileSystemProvider.prototype.stat = function (uri) {
        return this._stat(uri.fsPath);
    };
    FileSystemProvider.prototype._stat = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = filestat_1.FileStat.bind;
                        return [4 /*yield*/, this._fileFunctions.stat(path)];
                    case 1: return [2 /*return*/, new (_a.apply(filestat_1.FileStat, [void 0, _b.sent()]))()];
                }
            });
        });
    };
    FileSystemProvider.prototype.readDirectory = function (uri) {
        return this._readDirectory(uri);
    };
    FileSystemProvider.prototype._readDirectory = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var children, result, i, child, stat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._fileFunctions.readdir(uri.fsPath)];
                    case 1:
                        children = _a.sent();
                        result = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < children.length)) return [3 /*break*/, 5];
                        child = children[i];
                        return [4 /*yield*/, this._stat(path.join(uri.fsPath, child))];
                    case 3:
                        stat = _a.sent();
                        result.push([child, stat.type]);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, Promise.resolve(result)];
                }
            });
        });
    };
    FileSystemProvider.prototype.readFile = function (uri) {
        return this._fileFunctions.readfile(uri.fsPath);
    };
    // tree data provider
    FileSystemProvider.prototype.getChildren = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var children, workspaceFolder, children;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!element) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.readDirectory(element.uri)];
                    case 1:
                        children = _a.sent();
                        return [2 /*return*/, children.map(function (_a) {
                                var name = _a[0], type = _a[1];
                                return ({
                                    uri: vscode.Uri.file(path.join(element.uri.fsPath, name)),
                                    type: type
                                });
                            })];
                    case 2:
                        workspaceFolder = vscode.workspace.workspaceFolders.filter(function (folder) { return folder.uri.scheme === 'file'; })[0];
                        if (!workspaceFolder) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.readDirectory(workspaceFolder.uri)];
                    case 3:
                        children = _a.sent();
                        children.sort(function (a, b) {
                            if (a[1] === b[1]) {
                                return a[0].localeCompare(b[0]);
                            }
                            return a[1] === vscode.FileType.Directory ? -1 : 1;
                        });
                        return [2 /*return*/, children.map(function (_a) {
                                var name = _a[0], type = _a[1];
                                return ({
                                    uri: vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, name)),
                                    type: type
                                });
                            })];
                    case 4: return [2 /*return*/, []];
                }
            });
        });
    };
    FileSystemProvider.prototype.getTreeItem = function (element) {
        var treeItem = new vscode.TreeItem(element.uri, element.type === vscode.FileType.Directory
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None);
        if (element.type === vscode.FileType.File) {
            treeItem.command = {
                command: 'fileExplorer.openFile',
                title: 'Open File',
                arguments: [element.uri]
            };
            treeItem.contextValue = 'file';
        }
        return treeItem;
    };
    return FileSystemProvider;
}());
exports.FileSystemProvider = FileSystemProvider;
