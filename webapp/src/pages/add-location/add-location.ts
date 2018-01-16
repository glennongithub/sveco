import {Component, NgZone} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { location, area } from '../../model/location.model';
import {LocationsProvider} from "../../providers/locations-provider/locations-provider";
import {} from '@types/googlemaps';
import { Geolocation } from '@ionic-native/geolocation';
import {AddressAutocompletePage} from "../modal-address-autocomplete/addressAutocomplete";


@IonicPage()
@Component({
  selector: 'page-add-location',
  templateUrl: 'add-location.html',
})
export class AddLocationPage {
    address:any;

    location:location;
    locationsProvider: LocationsProvider;
    area:area;
    availableAreas: area[];
    selectedAreaId : number; // Holds id selected in form.  Attach correct area object via method call
    supportedLanguages = [
      {languageValue: 'SWEDISH', languageLabel: 'Swedish' },
      {languageValue: 'DANISH', languageLabel: 'Danish' },
      {languageValue: 'NORWEGIAN', languageLabel: 'Norwegian' },
      {languageValue: 'UNKNOWN', languageLabel: 'Unknown' },
    ];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                locationsProvider: LocationsProvider,
                private zone: NgZone, //maybe not used
                private geolocation: Geolocation, //maybe not used
                private modalCtrl: ModalController
                ) {

        // Testing modal version
        this.address = {
            input: ''
        };


      this.locationsProvider = locationsProvider;
      this.area = {id:0, areaName:''};
      this.location = {
        language: 'UNKNOWN',
        address: '',
        formattedAddressString: '',
        area: this.area,
        note: '',
        type: 'HOUSE', //setting this as default for now
        status: 'NOT_AT_HOME',
        isBusiness: false,
        isReturnVisit: false,
        apartmentNr: '',
      };

      this.availableAreas = locationsProvider.getAreas();
      console.log(this.availableAreas);


    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad AddLocationPage');
    }

    showAddressModal () {
        let modal = this.modalCtrl.create(AddressAutocompletePage);
        let me = this;
        modal.onDidDismiss(data => {
            //only try to set if finding correct data
            if(data && data.selectedItem)
            {
                me.address.input = data.selectedItem.description;
                me.location.address = data.parsedData;
            }

        });
        modal.present();
    }

    addLocation(location) {

        //add autocompleted string from googleApi as formatted string.. we may create this manually from address data later if we want
        this.location.formattedAddressString = this.address.input;

        //and use the parts of the address we want in address json field
        //this.location.address = this.dataToSaveInDB;


        //TODO  make some validations. we need to force some validation ..
        // like if type is apartment .. we need to force apartmentnr i think
        // maybe manual or automatic by using whats described here with form-controls and stuff https://www.joshmorony.com/advanced-forms-validation-in-ionic-2/

        //user area-id to set correct area on new location
        if(this.selectedAreaId != 0)
          this.location.area = this.availableAreas.find(this.findItemById, this.selectedAreaId);
        else
          this.location.area = {id:0, areaName:'Not selected'}; // this is used when pushed to local data ... when sent to server it is set to something similar there



        //now push it to locationsProvider copy of what we work with
        this.locationsProvider.addLocation(location).then((locations) => {
          //navigate back to locations.  ionWilShow makes sure it reloads with updated data
            this.navCtrl.pop();

        });
    }

  //
  // Supportfunction
    findItemById(lookingAtItem) {
        return lookingAtItem.id === this;
    }
}
