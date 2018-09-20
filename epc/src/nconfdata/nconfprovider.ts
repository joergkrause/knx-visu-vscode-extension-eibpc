import * as vscode from 'vscode';
import * as child from 'child_process';
import * as path from 'path';

import { NConfDataProvider } from './nconfdataprovider';

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
