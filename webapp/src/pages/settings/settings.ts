import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CustomApiProvider } from '../../providers/custom-api/custom-api';
import { ModalErrorPage } from "../modal-error/modal-error";
import { ModalInfoPage } from "../modal-info/modal-info";

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  //Those vars are used in case we would like to try to getApiKey .. first time .. or on reauth
  reauthUsername: string;
  reauthPassword: string;
  loader:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private modal: ModalController,
              public loadingCtrl: LoadingController,
              private customApi: CustomApiProvider) {
    this.customApi.loadCustomUserFromStorageToProvider();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  ionViewWillEnter()
  {
    console.log(' About to show page . ');
    //here we will always make sure to reload the data we need from remote locations.  To make sure se show the most
    //current data.
  }

  reAuthenticate() {
    //needs to be recreated each time
    this.loader = this.loadingCtrl.create({
      content:"Talking to server",
    });
    //pop overlay
    this.loader.present();

    //try to get apiKey
    this.customApi.getApiKey(this.reauthUsername, this.reauthPassword)
        .subscribe(data => { //a successful connection
          console.log(data);
          //always remove overlay when done
          this.loader.dismiss();


          //let jsonData = data.json(); /* new httpClient return jsonObject as default.. no need to parse it*/
          let jsonData = data;
          if(jsonData.error)
          {
            //if failed like this .. with error from server..
            // even if we had some working before .. kill tha local storage values ..
            this.customApi.authCustomUser.userName = '';
            this.customApi.authCustomUser.apiKey = '';
            this.customApi.authCustomUser.fullname = '';
            //if successful store in local storage
            this.storage.set(this.customApi.customLocalStorageIdentifier, JSON.stringify(this.customApi.authCustomUser));

            //error show error
            this.openErrorModal(jsonData.error);
          } else {
            //Rigth.. no erros reported move along
            if(jsonData.key && jsonData.username )
            {
              this.customApi.authCustomUser.userName = jsonData.username;
              this.customApi.authCustomUser.apiKey = jsonData.key;
              this.customApi.authCustomUser.fullname = jsonData.fullname;
              //if successful store in local storage
              this.storage.set(this.customApi.customLocalStorageIdentifier, JSON.stringify(this.customApi.authCustomUser)).then(() => {
                    // ok now we have a auth user stored ..
                    //pop infoModal and
                    this.openInfoModal('You successfully authenticated as user: '+ this.customApi.authCustomUser.fullname +'. This device will continue to be logged in as thi user until key is removed or changed.');
                    //behind it load HomePage
                    this.navCtrl.parent.select(0);
                  }
              );
            } else {
              //we got some kind of error we did not prep for ..
              this.openErrorModal('Missing user and key in response .. don\'t know why?!?')
            }
          }


        }, errdata => { //failed connection
          //always remove overlay when done
          this.loader.dismiss();
          this.openErrorModal('Communication with server failed .. : '+errdata.statusText);
        });


  }

  openErrorModal(errorMessage: string) {
    const errorModal = this.modal.create(ModalErrorPage, {errorMessage: errorMessage});
    errorModal.present();
  }

  openInfoModal(infoMessage: string) {
    const infoModal = this.modal.create(ModalInfoPage, {infoMessage: infoMessage});
    infoModal.present();
  }

}
