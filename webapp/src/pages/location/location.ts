import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController  } from 'ionic-angular';
import { Platform, ActionSheetController } from 'ionic-angular';
import { CustomApiProvider } from '../../providers/custom-api/custom-api';
import { location } from "../../model/location.model";
import {LocationsProvider} from "../../providers/locations-provider/locations-provider";



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
    changeDetected: boolean = false

    supportedLanguages = [
        {languageValue: 'SWEDISH', languageLabel: 'Swedish' },
        {languageValue: 'DANISH', languageLabel: 'Danish' },
        {languageValue: 'NORWEGIAN', languageLabel: 'Norwegian' },
        {languageValue: 'UNKNOWN', languageLabel: 'Unknown' },
    ];

    constructor(
        public navCtrl: NavController,
        private alertCtrl: AlertController,
        public navParams: NavParams,
        public platform: Platform,
        public actionsheetCtrl: ActionSheetController,
        public customApi: CustomApiProvider,
        public locationsProvider: LocationsProvider,
    ) {
        this.location = this.navParams.get('location');
        this.authCustomUser = this.navParams.get('authCustomUser');

        // set if it is my RV
        this.isMyReturnVisit = (this.location.user.username == this.customApi.authCustomUser.userName && this.location.isReturnVisit);
        this.skipNextRvChange = false; // this is so when a isMyRv status is changed but cancelled we are not poping confirmations

    }
    ionViewDidLoad() {
        this.setBackButtonAction()
    }

    setBackButtonAction(){
        this.navbarCustom.backButtonClick = () => {
            console.log("going back");
            // Updating master-array and possibly backend via api
            if(this.changeDetected)
                this.updateLocation(this.location);

            //if communication with server takes time .. to navigation will happen instantly but spinner will stay on top until done
            this.navCtrl.pop()
        }
    }

    updateLocation(location) {
        this.locationsProvider.updateLocation(location).then( updatedLocationReturned => {
            console.log("Updated location:"+JSON.stringify(updatedLocationReturned))
            }
        );
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
               if(location.isReturnVisit && location.user.username != this.customApi.authCustomUser.userName)
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
        location.user.username = this.customApi.authCustomUser.userName;
        //also setting fullname so that local data display correctly without reload
        location.user.fullname = this.customApi.authCustomUser.fullname;
        // maybe also kill id .. so that we crash if we try to use that on local copy of user
        // since the id now is not correctly connected to the id in db ..
        location.user.id = null;
    }



    onChangeAnything(location) {
        this.changeDetected = true;
        console.log('change detected . but dont do anything until be gp back');
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
}