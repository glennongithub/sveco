import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController  } from 'ionic-angular';
import { Platform, ActionSheetController } from 'ionic-angular';
import { CustomApiProvider } from '../../providers/custom-api/custom-api';
import {location, area, visit} from "../../model/location.model";
import {LocationsProvider} from "../../providers/locations-provider/locations-provider";

import { ModalErrorPage } from "../modal-error/modal-error";
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import {AddressAutocompletePage} from "../modal-address-autocomplete/addressAutocomplete";
import {ModalAddVisitPage} from "../modal-add-visit/modal-add-visit";
import {ModalSortPage} from "../modal-sort/modal-sort";



@Component({
    selector: 'page-location',
    templateUrl: 'location.html',

})


export class LocationPage {
    @ViewChild(Navbar) navbarCustom: Navbar;
    location:location;
    skipNextRvChange:boolean;
    isMyReturnVisit: boolean;
    authCustomUser:{
        userName: string,
        apiKey: string
    };
    changeDetected: boolean = false;
    temp : Date;

    supportedLanguages = [
        {languageValue: 'SWEDISH', languageLabel: 'Swedish' },
        {languageValue: 'DANISH', languageLabel: 'Danish' },
        {languageValue: 'NORWEGIAN', languageLabel: 'Norwegian' },
        {languageValue: 'UNKNOWN', languageLabel: 'Unknown' },
    ];

    availableAreas : area[];

    constructor(
        public navCtrl: NavController,
        private alertCtrl: AlertController,
        private modal: ModalController,
        public navParams: NavParams,
        public platform: Platform,
        public actionsheetCtrl: ActionSheetController,
        public customApi: CustomApiProvider,
        public locationsProvider: LocationsProvider,
    ) {
        this.location = this.navParams.get('location');
        // if this location does not belong to a array .. we set up a not "selected area"
        if(!this.location.area)
            this.location.area = {id:0, areaName:"Not selected"};

        this.authCustomUser = this.navParams.get('authCustomUser');
        this.locationsProvider.loadRemoteAreas().then(returnedCopyOfAreas => {
            this.availableAreas = returnedCopyOfAreas;
            console.log(returnedCopyOfAreas);
        }, errdata => { //failed connection
            //always remove overlay when done
            this.openErrorModal('Communication with server failed .. : '+errdata.statusText);
        });

        // set if it is my RV
        this.isMyReturnVisit = (this.location.user.username == this.customApi.authCustomUser.username && this.location.isReturnVisit);
        this.skipNextRvChange = false; // this is so when a isMyRv status is changed but cancelled we are not poping confirmations

        //loop through all visits an set locationId .. might be needed in delete
        this.location.visits.forEach( visit => {
            visit.locationId = this.location.id;
        })
    }
    ionViewDidLoad() {
        this.setBackButtonAction()
    }

    showAddressModal (location) {
        let modal = this.modal.create(AddressAutocompletePage, {location:location});
        let me = this;
        modal.onDidDismiss(data => {
            //only try to set if finding correct data
            if(data && data.selectedItem)
            {
                me.location.formattedAddressString = data.selectedItem.description;
                me.location.address = data.parsedData;
                me.changeDetected = true; //make sure we update always if we visited addressSelectorPage
            }

        });
        modal.present();
    }

    setBackButtonAction(){
        this.navbarCustom.backButtonClick = () => {
            console.log("going back");
            // Updating master-array and possibly backend via api
            if(this.changeDetected)
                this.updateLocation(this.location).then(updatedLocationReturned => {
                    console.log("Updated location:"+JSON.stringify(updatedLocationReturned));
                    // will not allow for navigate back untill update is done . because i that case we might get old data when loading in locations
                    this.navCtrl.pop();
                });
            else
                this.navCtrl.pop();
        }
    }

    async updateLocation(location) {
        try {
            return await this.locationsProvider.updateLocation(location);
        } catch(e) {
            console.log('catch in locationPge: updateLocation()  .. :'+e.toString());
        }
    }

    test() {
        console.log(this.isMyReturnVisit);
    }

    changeReturnVisitStatusHandler(location){
       if(this.skipNextRvChange)
       {
           // Make sure next change is handled
           this.skipNextRvChange = false;
       } else {
           //
           // It's not my RV already ..
           //
           // value of isMyReturnVissit is what it became after click .. so if true .. it mean it was false .. and now user want to claim it.
           if(this.isMyReturnVisit)
           {
               // But it already was someone else's
               if(location.isReturnVisit && location.user.username != this.customApi.authCustomUser.username)
               {
                   let alert = this.alertCtrl.create({
                       title: 'Confirm RV-claim',
                       message: 'This is already a RV to : '+location.user.fullname+'. Are you sure you want to claim it as your\'s',
                       buttons: [
                           {
                               text: 'Cancel',
                               role: 'cancel',
                               handler: () => {
                                   console.log('Cancel clicked');
                                   this.isMyReturnVisit = false; // force it back to not mine RV
                                   this.skipNextRvChange = true;

                               }
                           },
                           {
                               text: 'Claim',
                               handler: () => {
                                   console.log('Claim clicked and set to new user');
                                   this.changeReturnVisitStatus(location); // perform necessary actions to update rv fields
                               }
                           }
                       ]
                   });
                   alert.present();
               } else {
                   // No one else already had it .. so just update it to be ours
                   this.changeReturnVisitStatus(location); // perform necessary actions to update rv fields
               }
               // End of making it my RV
               ///////////////////////////

           } else {
               ///////////////////////////////////////////
               //it was our RV but we want to remove it
               // always require confirm

               let alert = this.alertCtrl.create({
                   title: 'Confirm RV removal',
                   message: 'Are you sure you want to remove this as you\'r RV',
                   buttons: [
                       {
                           text: 'Cancel',
                           role: 'cancel',
                           handler: () => {
                               console.log('Cancel clicked');
                               this.isMyReturnVisit = true; //force it back
                               this.skipNextRvChange = true;
                           }
                       },
                       {
                           text: 'Remove',
                           handler: () => {
                               console.log('RV removed from user');
                               this.changeReturnVisitStatus(location); // perform necessary actions to update rv fields
                           }
                       }
                   ]
               });
               alert.present();
           }
       }

    }

    changeReturnVisitStatus(location) {
        this.changeDetected = true; //make sure we run update when clicking back
        // setting both those values below .. should force updating of isReturnVisit and user on server-side.
        location.isReturnVisit = this.isMyReturnVisit;
        location.user.username = this.customApi.authCustomUser.username;
        //also setting fullname so that local data display correctly without reload
        location.user.fullname = this.customApi.authCustomUser.fullname;
        // maybe also kill id .. so that we crash if we try to use that on local copy of user
        // since the id now is not correctly connected to the id in db ..
        location.user.id = null;
    }



    onChangeAnything(location) {
        this.changeDetected = true;
        console.log('change detected . but dont do anything until be go back');
    }


    deleteVisit(visit)
    {
      try {
        this.locationsProvider.deleteVisitFromLocation(visit).then(response => {
          console.log('Visit deleted: ' +response);
        });
      } catch(e) {
          console.log('catch in locationPage: deleteVisit()  .. :'+e.toString());
      }

    }


    openMenu() {
        let actionSheet = this.actionsheetCtrl.create({
            title: 'Albums',
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        console.log('Delete clicked');
                    }
                },
                {
                    text: 'Share',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: () => {
                        console.log('Share clicked');
                    }
                },
                {
                    text: 'Play',
                    icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
                    handler: () => {
                        console.log('Play clicked');
                    }
                },
                {
                    text: 'Favorite',
                    icon: !this.platform.is('ios') ? 'heart-outline' : null,
                    handler: () => {
                        console.log('Favorite clicked');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    openAddVisitModal(location: location) {
      const addVisitModal = this.modal.create(ModalAddVisitPage, { location: location, user: this.customApi.authCustomUser });
      addVisitModal.present();
    }

    openEditVisitModal(visit: visit) {
      const editVisitModal = this.modal.create(ModalAddVisitPage, {visit: visit});
      editVisitModal.present();
    }

    openErrorModal(errorMessage: string) {
        const errorModal = this.modal.create(ModalErrorPage, {errorMessage: errorMessage});
        errorModal.present();
    }

}
