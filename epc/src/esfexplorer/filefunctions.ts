import * as vscode from 'vscode';
import * as fs from 'fs';

export class FileFunctions {

  private handleResult<T>(
    resolve: (result: T) => void,
    reject: (error: Error) => void,
    error: Error | null | undefined,
    result: T
  ): void {
    if (error) {
      reject(this.messageError(error));
    } else {
      resolve(result);
    }
  }

  private messageError(error: Error & { code?: string }): Error {
    if (error.code === 'ENOENT') {
      return vscode.FileSystemError.FileNotFound();
    }

    if (error.code === 'EISDIR') {
      return vscode.FileSystemError.FileIsADirectory();
    }

    if (error.code === 'EEXIST') {
      return vscode.FileSystemError.FileExists();
    }

    if (error.code === 'EPERM' || error.code === 'EACCESS') {
      return vscode.FileSystemError.NoPermissions();
    }

    return error;
  }

  public checkCancellation(token: vscode.CancellationToken): void {
    if (token.isCancellationRequested) {
      throw new Error('Operation cancelled');
    }
  }

  public  normalizeNFC(items: string): string;
  public  normalizeNFC(items: string[]): string[];
  public normalizeNFC(items: string | string[]): string | string[] {
    if (process.platform !== 'darwin') {
      return items;
    }

    if (Array.isArray(items)) {
      return items.map(item => item.normalize('NFC'));
    }

    return items.normalize('NFC');
  }

  public readdir(path: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(path, (error, children) =>
        this.handleResult(
          resolve,
          reject,
          error,
          this.normalizeNFC(children)
        )
      );
    });
  }

  public stat(path: string): Promise<fs.Stats> {
    return new Promise<fs.Stats>((resolve, reject) => {
      fs.stat(path, (error, stat) =>
        this.handleResult(resolve, reject, error, stat)
      );
    });
  }

  public readfile(path: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(path, (error, buffer) =>
        this.handleResult(resolve, reject, error, buffer)
      );
    });
  }

  public writefile(path: string, content: Buffer): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(path, content, error =>
        this.handleResult(resolve, reject, error, void 0)
      );
    });
  }

  public exists(path: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.exists(path, exists =>
        this.handleResult(resolve, reject, null, exists)
      );
    });
  }

  public rename(oldPath: string, newPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.rename(oldPath, newPath, error =>
        this.handleResult(resolve, reject, error, void 0)
      );
    });
  }

  public unlink(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(path, error =>
        this.handleResult(resolve, reject, error, void 0)
      );
    });
  }
}
