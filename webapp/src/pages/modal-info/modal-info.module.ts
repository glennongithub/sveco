import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalInfoPage } from './modal-info';

@NgModule({
  declarations: [
    ModalInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalInfoPage),
  ],
})
export class ModalInfoPageModule {}
