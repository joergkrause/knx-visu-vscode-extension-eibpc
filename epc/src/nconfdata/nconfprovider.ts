import * as vscode from 'vscode';
import * as child from 'child_process';
import * as path from 'path';

class NConfDataProvider implements vscode.TreeDataProvider<string> {
  getTreeItem(element: string): vscode.TreeItem | Thenable<vscode.TreeItem> {
    let treeitem = new vscode.TreeItem(element);
    return treeitem;
  }
  async getChildren(element?: string): Promise<string[]> {
    let nconf = new Array<string>();
    nconf.push('Time Zone');
    nconf.push('Time and Date');
    nconf.push('NTP State');
    nconf.push('Firmware');
    let file = path.join(__dirname, 'resources/nconf.exe');
    try {
      // let result = child.execFileSync(file, ['-z0', '192.168.0.12']);
      // nconf.push('Time ' + result);
    } catch (err) {
      nconf.push('Error' + err);
    }
    return await nconf;
  }
}

export class NconfProvider {
  private nconfProvider: vscode.TreeView<string>;

  constructor(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.commands.registerCommand('knx.setTime', resource => {})
    );
    context.subscriptions.push(
      vscode.commands.registerCommand('knx.setIP', resource => {})
    );
    context.subscriptions.push(
      vscode.commands.registerCommand('knx.restart', resource => {})
    );

    // read the CSV and pump the values to tree view
    let treeDataProvider = new NConfDataProvider();
    this.nconfProvider = vscode.window.createTreeView('nconf-view-knx', {
      treeDataProvider
    });
  }
}
