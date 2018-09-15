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
var fs = require("fs");
var csv = require('csv');
var iconv = require('iconv-lite');
var es = require('event-stream');
var entry_1 = require("./entry");
var EsfTransformer = /** @class */ (function () {
    function EsfTransformer(entries) {
        this.entries = entries;
    }
    EsfTransformer.prototype.parse = function (data, cb) {
        if (data.length < 4)
            return;
        // data is an Array of 4 (Structure, Name, DataType, Flag)
        var struct = data[0].split('.');
        var hg = struct[0], mg = struct[1], ga = struct[2];
        var _a = struct[2].split('/'), gahg = _a[0], gamg = _a[1], gaad = _a[2];
        var name = data[1];
        var type = data[2];
        var flag = data[3];
        // main group does not exists?
        if (this.entries.filter(function (d) { return d.name === hg; }).length === 0) {
            console.log('Add HG ' + hg);
            this.entries.push({
                name: hg,
                rawnumber: +gahg,
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
        if (hgEntry.children.filter(function (d) { return d.name === mg; }).length === 0) {
            hgEntry.children.push({
                name: mg,
                rawnumber: +gamg,
                fullName: gamg + " " + mg,
                type: entry_1.EntryType.MiddleGroup
            });
        }
        var addressEntry = hgEntry.children.filter(function (d) { return d.name === mg; })[0];
        // does group has children?
        if (!addressEntry.children) {
            addressEntry.children = new Array();
        }
        // no test here, we assume that the export cannot export the same item twice
        addressEntry.children.push({
            name: ga,
            rawnumber: +gaad,
            fullName: gaad + " " + name + " (" + type + ")",
            type: entry_1.EntryType.Address,
            initGA: flag === 'Low' ? false : true // TODO: this is wrong!
        });
        if (cb) {
            cb();
        }
    };
    return EsfTransformer;
}());
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
        var reader = fs
            .createReadStream(this.file)
            .pipe(iconv.decodeStream('windows1252'));
        console.log('Create ESF Entries: Stream Read');
        var esfTransformer = new EsfTransformer(this.entries);
        reader.pipe(es.split()).pipe(es
            .mapSync(function (line) {
            esfTransformer.parse(line.split('\t'));
        })
            .on('error', function (err) { return console.error('Err: ' + err); })
            .on('end', function () {
            console.log('End');
        }));
        console.log('Create ESF Entries: Stream Parsed');
    };
    // tree data provider, get the raw tree
    FileSystemProvider.prototype.getChildren = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var children, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!element) {
                            this.entries = this.entries.sort(function (hg) { return hg.rawnumber <= hg.rawnumber ? -1 : 1; });
                            this.entries.map(function (e) {
                                if (e.children) {
                                    e.children = e.children.sort(function (mg) { return mg.rawnumber <= mg.rawnumber ? -1 : 1; });
                                    e.children.map(function (i) {
                                        if (i.children) {
                                            i.children = i.children.sort(function (ga) { return ga.rawnumber <= ga.rawnumber ? -1 : 1; });
                                        }
                                    });
                                }
                            });
                        }
                        if (!!element) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.entries];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, element.children];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        children = _a;
                        return [2 /*return*/, children];
                }
            });
        });
    };
    // makes tree items from entries
    FileSystemProvider.prototype.getTreeItem = function (element) {
        var treeItem = new vscode.TreeItem("" + element.fullName, vscode.TreeItemCollapsibleState.Expanded);
        if (element.type === entry_1.EntryType.Address) {
            treeItem.command = {
                command: 'esfExplorer.insertGroupAddress',
                title: 'Insert Address',
                arguments: [element.name]
            };
            treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
            treeItem.contextValue = 'address';
        }
        treeItem.tooltip = "(" + entry_1.EntryType[element.type] + ")";
        return treeItem;
    };
    return FileSystemProvider;
}());
exports.FileSystemProvider = FileSystemProvider;
//# sourceMappingURL=filesystemprovider.js.map