import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalErrorPage } from './modal-error';

@NgModule({
  declarations: [
    ModalErrorPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalErrorPage),
  ],
})
export class ModalErrorPageModule {}
