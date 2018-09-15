"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var stream = require("stream");
var fs = require("fs");
var csv = require('csv');
var entry_1 = require("./entry");
var EsfTransformer = /** @class */ (function (_super) {
    __extends(EsfTransformer, _super);
    function EsfTransformer(entries) {
        var _this = _super.call(this, { objectMode: true, highWaterMark: 1 }) || this;
        _this.entries = entries;
        return _this;
    }
    EsfTransformer.prototype._write = function (obj, _enc, cb) {
        var data = obj[0];
        // data is an Array of 4 (Structure, Name, DataType, Flag)
        var struct = data[0].split('.');
        var hg = struct[0], md = struct[1], ga = struct[2];
        var _a = struct[2].split('/'), gahg = _a[0], gamd = _a[1], gaad = _a[2];
        var name = data[1];
        var type = data[2];
        var flag = data[3];
        // main group does not exists?
        if (this.entries.filter(function (d) { return d.name === hg; }).length === 0) {
            this.entries.push({
                name: hg,
                fullName: gahg + " " + hg,
                type: entry_1.EntryType.MainGroup
            });
        }
        // after that we retrieve the one and only entry
        var hgEntry = this.entries.filter(function (d) { return d.name === hg; })[0];
        // already has children?
        if (!hgEntry.children) {
            hgEntry.children = new Array();
        }
        // does the middle group exists?
        if (hgEntry.children.filter(function (d) { return d.name === md; }).length === 0) {
            hgEntry.children.push({
                name: md,
                fullName: gamd + " " + md,
                type: entry_1.EntryType.MiddleGroup
            });
        }
        var addressEntry = hgEntry.children.filter(function (d) { return d.name === md; })[0];
        // does group has children?
        if (!addressEntry.children) {
            addressEntry.children = new Array();
        }
        // no test here, we assume that the export cannot export the same item twice
        addressEntry.children.push({
            name: gaad + " " + name,
            fullName: gaad + " " + name + " (" + type + ")",
            type: type,
            initGA: flag === 'Low' ? false : true // TODO: this is wrong!    
        });
        cb();
    };
    return EsfTransformer;
}(stream.Writable));
var FileSystemProvider = /** @class */ (function () {
    function FileSystemProvider(file) {
        this.file = file;
        this.entries = new Array();
        console.log('Create ESF Entries');
        this.createEntries();
    }
    // CSV entry looks like this:
    // Beleuchtung.Zentral.1/0/5    Licht Zentral AU (nur Handfunktionen)     EIS 1 'Switching' (1 Bit)     Low
    FileSystemProvider.prototype.createEntries = function () {
        var input = fs.createReadStream(this.file, { encoding: 'latin1' });
        console.log('Create ESF Entries: Stream Read');
        var parser = csv.parse({
            from: 2,
            rtrim: true,
            skip_empty_lines: true,
        });
        var transformer = csv.transform(function (record) {
            return record.map(function (value) {
                console.log(value);
                return value.split('\t');
            });
        });
        var esfTransformer = new EsfTransformer(this.entries);
        input
            .pipe(parser)
            .pipe(transformer)
            .pipe(esfTransformer);
        console.log('Create ESF Entries: Stream Parsed');
    };
    // tree data provider, get the raw tree
    FileSystemProvider.prototype.getChildren = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.entries) {
                    return [2 /*return*/, new Promise(function () {
                            return _this.entries;
                        })];
                }
                return [2 /*return*/, []];
            });
        });
    };
    // makes tree items from entries
    FileSystemProvider.prototype.getTreeItem = function (element) {
        var treeItem = new vscode.TreeItem("element.name (" + element.dataType + element.typeLen + ")");
        if (element.type === entry_1.EntryType.Address) {
            treeItem.command = {
                command: 'esfExplorer.insertGroupAddress',
                title: 'Insert Address',
                arguments: [element.name]
            };
            treeItem.contextValue = 'address';
        }
        return treeItem;
    };
    return FileSystemProvider;
}());
exports.FileSystemProvider = FileSystemProvider;
//# sourceMappingURL=filesystemprovider.js.map