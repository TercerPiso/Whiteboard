export interface FolderInput {
  name: string;
}

export interface FileData {
  name?: string;
  folderID?: string;
  content: string;
  preview: string;
}
