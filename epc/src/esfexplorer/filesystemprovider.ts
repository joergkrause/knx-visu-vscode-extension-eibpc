import * as vscode from 'vscode';
import * as path from 'path';
import * as stream from 'stream';
import * as fs from 'fs';
import * as util from 'util';
const csv = require('csv');
const iconv = require('iconv-lite');
const es = require('event-stream');

import { Entry, EntryType } from './entry';

class EsfTransformer {
  constructor(public entries: Entry[]) {}

  parse(data: Array<string>, cb?: () => void) {
    if (data.length < 4) return;
    // data is an Array of 4 (Structure, Name, DataType, Flag)
    let struct = data[0].split('.');
    let [hg, mg, ga] = struct;
    let [gahg, gamg, gaad] = struct[2].split('/');
    let name = data[1];
    let type = data[2];
    let flag = data[3];
    // main group does not exists?
    if (this.entries.filter(d => d.name === hg).length === 0) {
      console.log('Add HG ' + hg);
      this.entries.push({
        name: hg,
        rawnumber: +gahg,
        fullName: `${gahg} ${hg}`,
        type: EntryType.MainGroup
      });
    }
    // after that we retrieve the one and only entry
    var hgEntry = this.entries.filter(d => d.name === hg)[0];
    // already has children?
    if (!hgEntry.children) {
      hgEntry.children = new Array<Entry>();
    }
    // does the middle group exists?
    if (hgEntry.children.filter(d => d.name === mg).length === 0) {
      hgEntry.children.push({
        name: mg,
        rawnumber: +gamg,
        fullName: `${gamg} ${mg}`,
        type: EntryType.MiddleGroup
      });
    }
    var addressEntry = hgEntry.children.filter(d => d.name === mg)[0];
    // does group has children?
    if (!addressEntry.children) {
      addressEntry.children = new Array<Entry>();
    }
    // no test here, we assume that the export cannot export the same item twice
    addressEntry.children.push({
      name: ga, // 0 Zentral
      rawnumber: +gaad,
      fullName: `${gaad} ${name} (${type})`, // 0 Zentral
      type: EntryType.Address,
      initGA: flag === 'Low' ? false : true // TODO: this is wrong!
    });
    if (cb) {
      cb();
    }
  }
}

export class FileSystemProvider implements vscode.TreeDataProvider<Entry> {
  private entries: Entry[] = new Array<Entry>();

  constructor(private file: string) {
    console.log('Create ESF Entries');
    this.createEntries();
  }

  // CSV entry looks like this:
  // Beleuchtung.Zentral.1/0/5    Licht Zentral AU (nur Handfunktionen)     EIS 1 'Switching' (1 Bit)     Low
  private createEntries() {
    let reader = fs
      .createReadStream(this.file)
      .pipe(iconv.decodeStream('windows1252'));
    console.log('Create ESF Entries: Stream Read');
    let esfTransformer = new EsfTransformer(this.entries);
    reader.pipe(es.split()).pipe(
      es
        .mapSync(line => {          
          esfTransformer.parse(line.split('\t'));
        })
        .on('error', (err) => console.error('Err: ' + err))
        .on('end', () => {
          console.log('End');
        })
    );
    console.log('Create ESF Entries: Stream Parsed');
  }

  // tree data provider, get the raw tree
  async getChildren(element?: Entry): Promise<Entry[]> {
    if (!element){
      this.entries = this.entries.sort(hg => hg.rawnumber <= hg.rawnumber ? -1 : 1);
      this.entries.map(e => {
        if (e.children){
          e.children = e.children.sort(mg => mg.rawnumber <= mg.rawnumber ? -1 : 1);
          e.children.map(i => {
            if (i.children){
              i.children = i.children.sort(ga => ga.rawnumber <= ga.rawnumber ? -1 : 1);
            }
          })
        }
      });          
    }
    let children = !element ? await this.entries : await element.children;
    return children;
  }

  // makes tree items from entries
  getTreeItem(element: Entry): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      `${element.fullName}`,
      vscode.TreeItemCollapsibleState.Expanded
    );
    if (element.type === EntryType.Address) {
      treeItem.command = {
        command: 'esfExplorer.insertGroupAddress',
        title: 'Insert Address',
        arguments: [element.name]
      };
      treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;      
      treeItem.contextValue = 'address';
    }
    treeItem.tooltip = `(${EntryType[element.type]})`;
    return treeItem;
  }
}
