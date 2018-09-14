import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { Entry } from './entry';
import { FileStat } from './filestat';
import { FileFunctions } from './filefunctions';

export class FileSystemProvider
  implements vscode.TreeDataProvider<Entry>, vscode.FileSystemProvider {
  private _onDidChangeFile: vscode.EventEmitter<vscode.FileChangeEvent[]>;
  private _fileFunctions: FileFunctions;

  constructor() {
    this._onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    this._fileFunctions = new FileFunctions();
  }

  createDirectory(uri: vscode.Uri): void | Thenable<void> {
    throw new Error('Method not implemented.');
  }
  writeFile(
    uri: vscode.Uri,
    content: Uint8Array,
    options: { create: boolean; overwrite: boolean }
  ): void | Thenable<void> {
    throw new Error('Method not implemented.');
  }
  delete(
    uri: vscode.Uri,
    options: { recursive: boolean }
  ): void | Thenable<void> {
    throw new Error('Method not implemented.');
  }
  rename(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    options: { overwrite: boolean }
  ): void | Thenable<void> {
    throw new Error('Method not implemented.');
  }
  copy?(
    source: vscode.Uri,
    destination: vscode.Uri,
    options: { overwrite: boolean }
  ): void | Thenable<void> {
    throw new Error('Method not implemented.');
  }
  onDidChangeTreeData?: vscode.Event<Entry>;
  getParent?(element: Entry): vscode.ProviderResult<Entry> {
    throw new Error('Method not implemented.');
  }

  get onDidChangeFile(): vscode.Event<vscode.FileChangeEvent[]> {
    return this._onDidChangeFile.event;
  }

  watch(
    uri: vscode.Uri,
    options: { recursive: boolean; excludes: string[] }
  ): vscode.Disposable {
    const watcher = fs.watch(
      uri.fsPath,
      { recursive: options.recursive },
      async (event: string, filename: string | Buffer) => {
        const filepath = path.join(
          uri.fsPath,
          this._fileFunctions.normalizeNFC(filename.toString())
        );

        // TODO support excludes (using minimatch library?)
        this._onDidChangeFile.fire([
          {
            type:
              event === 'change'
                ? vscode.FileChangeType.Changed
                : (await this._fileFunctions.exists(filepath))
                  ? vscode.FileChangeType.Created
                  : vscode.FileChangeType.Deleted,
            uri: uri.with({ path: filepath })
          } as vscode.FileChangeEvent
        ]);
      }
    );

    return { dispose: () => watcher.close() };
  }

  stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
    return this._stat(uri.fsPath);
  }

  async _stat(path: string): Promise<vscode.FileStat> {
    return new FileStat(await this._fileFunctions.stat(path));
  }

  readDirectory(
    uri: vscode.Uri
  ): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
    return this._readDirectory(uri);
  }

  async _readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
    const children = await this._fileFunctions.readdir(uri.fsPath);

    const result: [string, vscode.FileType][] = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const stat = await this._stat(path.join(uri.fsPath, child));
      result.push([child, stat.type]);
    }

    return Promise.resolve(result);
  }

  readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
    return this._fileFunctions.readfile(uri.fsPath);
  }

  // tree data provider
  async getChildren(element?: Entry): Promise<Entry[]> {
    if (element) {
      const children = await this.readDirectory(element.uri);
      return children.map(([name, type]) => ({
        uri: vscode.Uri.file(path.join(element.uri.fsPath, name)),
        type
      }));
    }

    const workspaceFolder = vscode.workspace.workspaceFolders.filter(
      folder => folder.uri.scheme === 'file'
    )[0];
    if (workspaceFolder) {
      const children = await this.readDirectory(workspaceFolder.uri);
      children.sort((a, b) => {
        if (a[1] === b[1]) {
          return a[0].localeCompare(b[0]);
        }
        return a[1] === vscode.FileType.Directory ? -1 : 1;
      });
      return children.map(([name, type]) => ({
        uri: vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, name)),
        type
      }));
    }

    return [];
  }

  getTreeItem(element: Entry): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      element.uri,
      element.type === vscode.FileType.Directory
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );
    if (element.type === vscode.FileType.File) {
      treeItem.command = {
        command: 'fileExplorer.openFile',
        title: 'Open File',
        arguments: [element.uri]
      };
      treeItem.contextValue = 'file';
    }
    return treeItem;
  }
}
