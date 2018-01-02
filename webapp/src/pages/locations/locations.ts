import { Component } from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import { CustomApiProvider } from '../../providers/custom-api/custom-api';
import { ModalErrorPage } from "../modal-error/modal-error";
import { ModalInfoPage } from "../modal-info/modal-info";

import { LocationPage } from '../location/location';
import {Storage} from "@ionic/storage";
import {location} from "../../model/location.model";
import {LocationsProvider} from "../../providers/locations-provider/locations-provider";

@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',

})

export class LocationsPage {

    locationPage = LocationPage;
    locations:location[];
    loader:any;

    constructor(public navCtrl: NavController,
                  public navParams: NavParams,
                  private storage: Storage,
                  private modal: ModalController,
                  public loadingCtrl: LoadingController,
                  private customApi: CustomApiProvider,
                  private locationsProvider: LocationsProvider) {

      this.getLocations();
    }

    viewLocation(location) {
      this.navCtrl.push(this.locationPage, {location:location})
    }
    /**
     *
     */
    getLocations() {
        // //needs to be recreated each time
        // this.loader = this.loadingCtrl.create({
        //     content:"Talking to server",
        // });
        // //pop overlay
        // this.loader.present();


        this.locationsProvider.loadRemoteLocations().then(
            returnedCopyOfLocations => { //a successful connection
                // now locations is loaded in locationsProvider
                // we could use them from there .. or load them to local var
                this.locations = returnedCopyOfLocations;
                //this.loader.dismiss();
                /** always make sure to handle failed connections*/
            } , errdata => { //failed connection
                //always remove overlay when done
                //this.loader.dismiss();
                this.openErrorModal('Communication with server failed .. : '+errdata.statusText);
            }
        );

    }


    openErrorModal(errorMessage: string) {
        const errorModal = this.modal.create(ModalErrorPage, {errorMessage: errorMessage});
        errorModal.present();
    }
}
