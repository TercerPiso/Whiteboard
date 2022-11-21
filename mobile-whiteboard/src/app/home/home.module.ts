import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DocumentsComponent } from './documents/documents.component';
import { SaveComponent } from './save/save.component';
import { LoginComponent } from './login/login.component';
import { SignInWithApple } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, DocumentsComponent, SaveComponent, LoginComponent],
  providers: [SignInWithApple]
})
export class HomePageModule {}
