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
