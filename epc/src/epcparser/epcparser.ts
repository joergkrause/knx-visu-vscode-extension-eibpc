import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {
  window,
  commands,
  Disposable,
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument
} from 'vscode';

/**
 * This class checks the currently loaded EPC file and loads ESF, Macros, and pre-sets EibPc Connections.
 */
export class EpcParser {
  private _disposable: Disposable;
  private _statusBarItem: StatusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Left
  );

  constructor(context: ExtensionContext) {
    let subscriptions: Disposable[] = [];
    let epc = commands.registerCommand('epc.parseEpc', resource => {
      this.parse();
      window.onDidChangeActiveTextEditor(
        () => this.parse(),
        this,
        subscriptions
      );
    })
    context.subscriptions.push(epc);
    this._disposable = Disposable.from(...subscriptions);
  }

  dispose() {
    this._disposable.dispose();
  }

  parse() {
    // Get the current text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      this._statusBarItem.hide();
      return;
    }

    let doc = editor.document;

    // Only update status if a Markdown file
    if (doc.languageId === 'epc') {
      let content = doc.getText();
      let etsesf;
      const pattern = /((\[ETS-ESF\])(?:[^[])+)/i;
      if ((etsesf = pattern.exec(content)) !== null) {
        // found an [ETS-ESF] block
        let imports = etsesf.split('\n');
        // filter the block identifier and comments out
        imports = imports.filter(
          element => /((\/\/)\s*)|[\[]/.exec(element) === null
        );
        imports.forEach(element => {
          // did we found a valid path?
          if (fs.existsSync(element)) {
            // parse and show ion tree
            vscode.commands.executeCommand('esfExplorer.autoParse', element);
          }
        });
      }
      // Update the status bar
      this._statusBarItem.text = 'EPC loaded';
      this._statusBarItem.show();
    } else {
      this._statusBarItem.hide();
    }
  }
}
