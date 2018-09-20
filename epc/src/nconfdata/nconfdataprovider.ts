import * as path from 'path';
import * as vscode from 'vscode';

export class NConfDataProvider implements vscode.TreeDataProvider<string> {
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