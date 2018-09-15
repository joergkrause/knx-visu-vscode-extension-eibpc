import * as vscode from 'vscode';

export enum DataType {
  u,
  b,
  f,  
  c
}

export type TypeLen = number;

export enum EntryType {
  MainGroup,
  MiddleGroup,
  Group,
  Address
}

export interface Entry {
  name: string;
  type: EntryType;
  rawnumber: number;
  fullName?: string;
  dataType?: DataType;
  typeLen?: TypeLen;  
  initGA?: boolean;
  children?: Entry[];
}