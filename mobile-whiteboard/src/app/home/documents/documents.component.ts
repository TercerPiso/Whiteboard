import { FileData, FolderOutput, TFile, FilesOutput } from './../../fileserver/pojos';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FileserverService } from 'src/app/fileserver/fileserver.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {

  public folders: FolderOutput[];
  public filesInfolder: FilesOutput[];
  public folderSelectedID?: string;

  constructor(private readonly modal: ModalController,
              private readonly fsSrv: FileserverService,
              private readonly alertController: AlertController) { }

  ngOnInit() {
    // TODO: spinner loading
    this.fsSrv.getFolders().subscribe(d => {
      this.folders = d;
    }, e => {
      alert('error');
      console.error(e);
      // FIXME
    });
  }

  selectFolder(id: string) {
    this.folderSelectedID = id;
    // TODO: spinner loading
    this.fsSrv.getFolderContent(id).subscribe(d => {
      this.filesInfolder = d;
    }, e => {
      // TODO
      alert('ERROR');
      console.error(e);
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm(fileID: string) {
    this.modal.dismiss({
      fileID
    }, 'confirm');
  }

  async newFolder() {
    const alertObj = await this.alertController.create({
      header: 'Folder name',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: (evt) => {
            const name = evt.fname.trim();
            // TODO: loading
            this.fsSrv.addFolder(name).subscribe(d => {
              // TODO: reload folders
            }, e => {
              // TODO
              alert('error');
              console.error(e);
            });
          }
        }
      ],
      inputs: [
        {
          placeholder: 'Name',
          name: 'fname',
        },
      ],
    });
    alertObj.present();
  }

  async newFile(folderID: string) {
    const alertObj = await this.alertController.create({
      header: 'File name',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: (evt) => {
            const name = evt.fname.trim();
            // TODO: loading
            this.fsSrv.saveFile(folderID, name, new FileData()).subscribe(d => {
              this.confirm(d.fileID);
            }, e => {
              // TODO
              alert('error');
              console.error(e);
            });
          }
        }
      ],
      inputs: [
        {
          placeholder: 'Name',
          name: 'fname',
        },
      ],
    });
    alertObj.present();
  }

  removeFolder(folderID: string) {
    // TODO: loading and reload list
    this.fsSrv.removeFolder(folderID);
  }

  removeFile(fileID: string) {
    // TODO: loading and reload list
    this.fsSrv.removeFile(fileID);
  }

}
