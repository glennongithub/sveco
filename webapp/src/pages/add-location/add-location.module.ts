import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLocationPage } from './add-location';

@NgModule({
  declarations: [
    AddLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(AddLocationPage),
  ],
})
export class AddLocationPageModule {}
