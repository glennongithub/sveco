import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ModalController, App} from 'ionic-angular';
import { CustomApiProvider } from '../../providers/custom-api/custom-api';
import { ModalErrorPage } from "../modal-error/modal-error";
import {GogletestPage} from "../gogletest/gogletest";
import {LocationsProvider} from "../../providers/locations-provider/locations-provider";
import {LocationsPage} from "../locations/locations";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    loader: any;

    constructor(public navCtrl: NavController,
              private modal: ModalController,
              public loadingCtrl: LoadingController,
              private locationsProvider: LocationsProvider,
              private customApi: CustomApiProvider,
              private appCtrl:App) {


        //needs to be recreated each time
        this.loader = this.loadingCtrl.create({
        content:"Talking to server",
        });

        //maybe move those init and load-from-server methods to some more appropriate place. maybe tabs page
        // for now use home page as init page

        //pop overlay
        this.loader.present();

        this.customApi.init()
        .then(message => {
            //all fine .. also load areas to locationProvider
            this.locationsProvider.loadRemoteAreas().then(returnedCopyOfAreas => {
                console.log(returnedCopyOfAreas);
            }, errdata => { //failed connection
                console.log('Communication with server failed when loading areas.. : '+errdata.statusText);
                //always remove overlay when done
                //this.openErrorModal('Communication with server failed .. : '+errdata.statusText);
            });
          //all fine just remove overlay
          this.loader.dismiss();
        })
        .catch(message => {
          //ok we got an error  ..
          //first remove overlay spinner
          this.loader.dismiss();

          //somehow force tab3  settings.
          //this.navCtrl.setRoot(SettingsPage);
          this.navCtrl.parent.select(2);
          //then show message
          const errorModal = this.modal.create(ModalErrorPage, {errorMessage: message});
          errorModal.present();
        });




    }

    open_locations()
    {
      this.appCtrl.getRootNav().push(LocationsPage);
    }

    open_googletestpage() {
      this.navCtrl.push(GogletestPage)
    }

}
