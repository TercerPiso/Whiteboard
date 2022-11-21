export class Folder {
  public id: string;
  public files: TFile[];
  public name: string;
};

export class TFile {
  public id: string;
  public name: string;
  public preview: string;
}

export class FileData {
  public file: string;
  public preview: string;
}

export class FileWithMeta extends FileData {
  public updated: number;
  public created: number;
  public owner: string;
}

export interface ApiLoginOutput {
  token: string;
  expiration: number;
  sessionType: string;
}

export interface FolderOutput {
  _id: string;
  ownerID: string;
  name: string;
  created: string;
}

export interface FilesOutput {
  _id: string;
  crated: string;
  updated?: string;
  name: string;
  preview: string;
}
