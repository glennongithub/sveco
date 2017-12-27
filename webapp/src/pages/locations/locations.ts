import { Component } from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import { CustomApiProvider, location } from '../../providers/custom-api/custom-api';
import { ModalErrorPage } from "../modal-error/modal-error";
import { ModalInfoPage } from "../modal-info/modal-info";

import { LocationPage } from '../location/location';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',

})

export class LocationsPage {

    locationPage = LocationPage;
    locations:location[];
    loader:any;

 fakeApiData :any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private modal: ModalController,
              public loadingCtrl: LoadingController,
              private customApi: CustomApiProvider) {

      this.getLocations();

      this.fakeApiData = [
        {
            id: 1,
            type: 'appartment',
            address: 'Vista Alegre 24, 07015 Palma de Mallorca',
            status: 'unknown',
            language: 'swedish',
            visits: '3',
            note: 'This was a strange address'
        }
      ];
    }

    viewLocation(location) {
      this.navCtrl.push(this.locationPage, {location:location})
    }
    /**
     *
     */
    getLocations() {
        //needs to be recreated each time
        this.loader = this.loadingCtrl.create({
            content:"Talking to server",
        });
        //pop overlay
        this.loader.present();

        this.customApi.getLocations().subscribe(
            //NOW .. for now keep this handling of subsribe and stuff .. but
            //TODO lets think through if possible to generalize those calls to a provider so code in pages can be minimized
            data => { //a successful connection
                console.log(data);
                this.locations = data;
                //always remove overlay when done
                this.loader.dismiss();
                data.forEach(item =>{ console.log(item.address) })

                /** always make sure to handle failed connections*/
            } , errdata => { //failed connection
                //always remove overlay when done
                this.loader.dismiss();
                this.openErrorModal('Communication with server failed .. : '+errdata.statusText);
            }
        );
    }

    openErrorModal(errorMessage: string) {
        const errorModal = this.modal.create(ModalErrorPage, {errorMessage: errorMessage});
        errorModal.present();
    }
}
