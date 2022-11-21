import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FileserverService } from 'src/app/fileserver/fileserver.service';
import { Folder } from 'src/app/fileserver/pojos';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent implements OnInit {

  @Input() openedFileID?: string;
  public folders: Folder[];
  public selectedFolderID?: string;

  constructor(
    private readonly modal: ModalController,
    private readonly fsSrv: FileserverService,
    private readonly alertController: AlertController
  ) { }

  ngOnInit() {
    this.folders = this.fsSrv.getFolders();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    if(this.selectedFolderID) {
      const alert = await this.alertController.create({
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
              // TODO: add content
              const fileID = this.fsSrv.saveFile(this.selectedFolderID, name, '');
              this.modal.dismiss({fileID}, 'confirm');
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
      alert.present();
      return;
    }
    if(this.openedFileID) {
      console.log('Save on same file');
      // TODO: add content
      this.fsSrv.saveWithID(this.openedFileID, '');
      this.modal.dismiss({fileID: this.openedFileID}, 'confirm');
    }
  }

  async selectFolder(folderID: string) {
    this.selectedFolderID = folderID;
  }

  removeFolder(folderID: string) {
    this.fsSrv.removeFolder(folderID);
  }

}
