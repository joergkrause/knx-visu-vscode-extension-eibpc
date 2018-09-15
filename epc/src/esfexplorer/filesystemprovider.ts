import * as vscode from 'vscode';
import * as path from 'path';
import * as stream from 'stream';
import * as fs from 'fs';
const csv = require('csv');

import { Entry, EntryType } from './entry';

class EsfTransformer extends stream.Writable {  

  constructor(public entries: Entry[]) {
    super({ objectMode: true, highWaterMark: 1 });    
  }
  
  _write(obj, _enc, cb) {
    let data = obj[0];
    // data is an Array of 4 (Structure, Name, DataType, Flag)
    let struct = data[0].split('.');    
    let [ hg, md, ga ] = struct;
    let [ gahg, gamd, gaad ] = struct[2].split('/'); 
    let name = data[1];
    let type = data[2];
    let flag = data[3];
    // main group does not exists?
    if (this.entries.filter(d => d.name === hg).length === 0){
      this.entries.push({
        name: hg,
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
    if (hgEntry.children.filter(d => d.name === md).length === 0){
      hgEntry.children.push({
        name: md,
        fullName: `${gamd} ${md}`,
        type: EntryType.MiddleGroup
      });
    }
    var addressEntry = hgEntry.children.filter(d => d.name === md)[0];
    // does group has children?
    if (!addressEntry.children) {
      addressEntry.children = new Array<Entry>();
    }
    // no test here, we assume that the export cannot export the same item twice
    addressEntry.children.push({
      name: `${gaad} ${name}`, // 0 Zentral
      fullName: `${gaad} ${name} (${type})`, // 0 Zentral
      type: type,
      initGA: flag === 'Low' ? false : true // TODO: this is wrong!    
    });
    cb();
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
    let input = fs.createReadStream(this.file, { encoding: 'latin1' });
    console.log('Create ESF Entries: Stream Read');
    let parser = csv.parse({ 
      from: 2,
      rtrim: true,
      skip_empty_lines: true,

    });
    let transformer = csv.transform(function(record) {
      return record.map(function(value) {
        console.log(value);
        return value.split('\t');
      });
    });
    let esfTransformer = new EsfTransformer(this.entries);
    input
      .pipe(parser)
      .pipe(transformer)
      .pipe(esfTransformer);
    console.log('Create ESF Entries: Stream Parsed');
  }

  // tree data provider, get the raw tree
  async getChildren(element?: Entry): Promise<Entry[]> {
    if (this.entries) {
      return new Promise<Entry[]>(() => {
        return this.entries;
      });
    }
    return [];
  }

  // makes tree items from entries
  getTreeItem(element: Entry): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      `element.name (${element.dataType}${element.typeLen})`
    );
    if (element.type === EntryType.Address) {
      treeItem.command = {
        command: 'esfExplorer.insertGroupAddress',
        title: 'Insert Address',
        arguments: [element.name]
      };
      treeItem.contextValue = 'address';
    }
    return treeItem;
  }
}
