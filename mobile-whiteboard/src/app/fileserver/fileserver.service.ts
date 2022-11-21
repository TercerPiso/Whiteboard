import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppleSignInResponse } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import { ApiLoginOutput, FileData, FilesOutput, FileWithMeta, Folder, FolderOutput } from './pojos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileserverService {


  constructor(private readonly httpClient: HttpClient) { }

  doLogin(request: AppleSignInResponse): Observable<ApiLoginOutput> {
    return this.httpClient.post<ApiLoginOutput>(`${environment.api}/apple-login`, request);
  }

  getFolders() {
    return this.httpClient.get<FolderOutput[]>(`${environment.api}/file-manager/folders`, {
      headers: {
        authorization: `Bearer ${this.getSession()}`
      }
    });
  }

  getFolderContent(id: string) {
    return this.httpClient.get<FilesOutput[]>(`${environment.api}/file-manager/files/${id}`,{
      headers: {
        authorization: `Bearer ${this.getSession()}`
      }
    });
  }

  addFolder(content: {name: string}) {
    return this.httpClient.post<{
      ownerID: string;
      created: string;
      name: string;
      _id: string;
    }>(`${environment.api}/file-manager/folders`, content, {
      headers: {
        authorization: `Bearer ${this.getSession()}`
      }
    });
  }

  saveFile(folderID: string, name: string, content: FileData) {
    return this.httpClient.post<{fileID: string}>(`${environment.api}/file-manager/files`, {
      name,
      folderID,
      content: content.file,
      preview: content.preview,
    }, {
      headers: {
        authorization: `Bearer ${this.getSession()}`
      }
    });
  }

  saveWithID(fileID: string, content: FileData) {
    return this.httpClient.post(`${environment.api}/file-manager/files/${fileID}`, {
      content: content.file,
      preview: content.preview,
    }, {
      headers: {
        authorization: `Bearer ${this.getSession()}`
      }
    });
  }

  removeFile(fileID: string) {
    return this.httpClient.delete(`${environment.api}/file-manager/files/${fileID}`, {
      headers: {
        authorization: `Bearer ${this.getSession()}`
      }
    });
  }

  removeFolder(folderID: string) {
    return this.httpClient.delete(`${environment.api}/file-manager/folders/${folderID}`, {
      headers: {
        authorization: `Bearer ${this.getSession()}`
      }
    });
  }

  getFileData(fileID: string) {
    // TODO
    return this.httpClient.get<{
      _id: string;
      ownerID: string;
      folderID: string;
      preview: string;
      fullFile: string;
      name: string;
      created: string;
      lastUpdate: string;
    }>(`${environment.api}/file-manager/file/${fileID}`, {
      headers: {
        authorization: `Bearer ${this.getSession()}`
      }
    });
  }

  getSession() {
    return localStorage.getItem('JWT');
  }

  setSession(jwt: string) {
    return localStorage.setItem('JWT', jwt);
  }
}
