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

