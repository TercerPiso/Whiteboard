import { Injectable } from '@angular/core';
import { FileData, FileWithMeta, Folder } from './pojos';

@Injectable({
  providedIn: 'root'
})
export class FileserverService {

  private folders: Folder[] = [
    {
      id: '0x000043',
      name: 'Autosave',
      files: [
        {
          id: '0x0123asd',
          name: 'Last saved 21/11/22 11:19',
          preview: 'https://i.imgur.com/OQI4Mvh.png'
        },
        {
          id: '0x0123asd',
          name: 'Saraza',
          preview: 'https://i.imgur.com/OQI4Mvh.png'
        }
      ]
    },
    {
      id: '0x000044',
      name: 'Test',
      files: [
        {
          id: '0x0123asd',
          name: 'Testing',
          preview: 'https://i.imgur.com/OQI4Mvh.png'
        }
      ]
    }
  ];

  constructor() { }

  getFolders() {
    return this.folders;
  }

  getFolderContent(id: string) {
    console.log(`Folder id ${id}`);
    return this.folders.find(folder => folder.id === id).files;
  }

  addFolder(name: string) {
    this.folders.push({
      id: 'NewFolder' + this.folders.length,
      name,
      files: []
    });
  }

  saveFile(folderID: string, fileName: string, content: FileData) {
    alert('Work in progress');
    return 'FILE-ID';
  }

  saveWithID(fileID: string, content: FileData) {
    alert('Work in progress');
  }

  removeFile(fileID: string) {
    let fileIdx = 0;
    const folder = this.folders.find(f => {
      fileIdx = f.files.findIndex(file => file.id === fileID);
      return fileIdx >= 0;
    });
    if(folder) {
      folder.files.splice(fileIdx, 1);
    }
  }

  removeFolder(folderID: string) {
    const idx = this.folders.findIndex(f => f.id === folderID);
    this.folders.splice(idx, 1);
  }

  getFileData(fileID: string): FileWithMeta {
    return new FileWithMeta();
  }
}
