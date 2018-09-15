"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var FileStat = /** @class */ (function () {
    function FileStat(fsStat) {
        this.fsStat = fsStat;
    }
    Object.defineProperty(FileStat.prototype, "type", {
        get: function () {
            return this.fsStat.isFile()
                ? vscode.FileType.File
                : this.fsStat.isDirectory()
                    ? vscode.FileType.Directory
                    : this.fsStat.isSymbolicLink()
                        ? vscode.FileType.SymbolicLink
                        : vscode.FileType.Unknown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileStat.prototype, "isFile", {
        get: function () {
            return this.fsStat.isFile();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileStat.prototype, "isDirectory", {
        get: function () {
            return this.fsStat.isDirectory();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileStat.prototype, "isSymbolicLink", {
        get: function () {
            return this.fsStat.isSymbolicLink();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileStat.prototype, "size", {
        get: function () {
            return this.fsStat.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileStat.prototype, "ctime", {
        get: function () {
            return this.fsStat.ctime.getTime();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileStat.prototype, "mtime", {
        get: function () {
            return this.fsStat.mtime.getTime();
        },
        enumerable: true,
        configurable: true
    });
    return FileStat;
}());
exports.FileStat = FileStat;
//# sourceMappingURL=filestat.js.map