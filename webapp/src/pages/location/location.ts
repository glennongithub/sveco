import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams, Navbar  } from 'ionic-angular';
import { Platform, ActionSheetController } from 'ionic-angular';
import { CustomApiProvider } from '../../providers/custom-api/custom-api';
import {$BACKSLASH} from "@angular/compiler/src/chars";
import { location } from "../../model/location.model";


@Component({
    selector: 'page-location',
    templateUrl: 'location.html',

})


export class LocationPage {
    @ViewChild(Navbar) navbarCustom: Navbar;
    location:location;
    showSaveButton:boolean;

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
    ) {
        this.location = this.navParams.get('location');
        this.showSaveButton = false;
    }

    ionViewDidLoad() {
        this.setBackButtonAction()
    }

    setBackButtonAction(){
        this.navbarCustom.backButtonClick = () => {
            console.log("going back");
            // Now we can control if we actually want to persist something to the db.

            if(this.waitingForPersist())
                // if we still have un-resolved promises from our api (or if we just have not even tried to save anything yet.)
                // we let them finish first.
                // pop spinner
                // and when when all done .. pop back

            this.navCtrl.pop()
        }
    }

    waitingForPersist() {

    }



    onChangeAnything(location) {
        //if note is changed.. handle in some special way .. not sure yet.
        // or .. show a button with this function .. to save changes .. which is not visible from start.
        this.showSaveButton = true;
        //console.log(location);
    }

    updateLocation(location) {
        // update db.. hmm .. and somehow make prev page update to.
        this.customApi.updateLocation(location).then( okVal=> {
            console.log(okVal)
            this.navCtrl.pop();
            }
           // instead of below .. make locationsPage reload locations in some way.
           // response => { this.getItems(); }
        );
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