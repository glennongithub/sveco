import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams, Navbar  } from 'ionic-angular';
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
    changeDetected: boolean = false

    supportedLanguages = [
        {languageValue: 'SWEDISH', languageLabel: 'Swedish' },
        {languageValue: 'DANISH', languageLabel: 'Danish' },
        {languageValue: 'NORWEGIAN', languageLabel: 'Norwegian' },
        {languageValue: 'UNKNOWN', languageLabel: 'Unknown' },
    ];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public actionsheetCtrl: ActionSheetController,
        public customApi: CustomApiProvider,
        public locationsProvider: LocationsProvider,
    ) {
        this.location = this.navParams.get('location');
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