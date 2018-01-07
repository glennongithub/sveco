import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { location, area } from '../../model/location.model';


@IonicPage()
@Component({
  selector: 'page-add-location',
  templateUrl: 'add-location.html',
})
export class AddLocationPage {

  location:location;
  area:area;
  supportedLanguages = [
    {languageValue: 'SWEDISH', languageLabel: 'Swedish' },
    {languageValue: 'DANISH', languageLabel: 'Danish' },
    {languageValue: 'NORWEGIAN', languageLabel: 'Norwegian' },
    {languageValue: 'UNKNOWN', languageLabel: 'Unknown' },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.area = {id:0, areaName:''}; 
    this.location = {
      language: '',
      address: '',
      formattedAddressString: '',
      area: this.area,
      note: '',
      type: '',
      status: '',
      isBusiness: false,
      isReturnVisit: false,
      apartmentNr: '',
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddLocationPage');
  }

}
