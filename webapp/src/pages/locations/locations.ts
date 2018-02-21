import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import { CustomApiProvider } from '../../providers/custom-api/custom-api';
import { ModalErrorPage } from "../modal-error/modal-error";
import { ModalSortPage } from "../modal-sort/modal-sort";
import { ModalFilterPage } from "../modal-filter/modal-filter";
import { ModalInfoPage } from "../modal-info/modal-info";

import { LocationPage } from '../location/location';
import {Storage} from "@ionic/storage";
import {location} from "../../model/location.model";
import {LocationsProvider} from "../../providers/locations-provider/locations-provider";
import { AddLocationPage } from '../add-location/add-location';
import 'rxjs/add/operator/debounceTime';
import {FormControl} from "@angular/forms";
import { ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',

})

export class LocationsPage {

    locationPage = LocationPage;
    addLocationPage = AddLocationPage;
    locations:location[];
    loader:any;
    searchString: string = '';
    searchControl: FormControl;
    searching:any = false;
    showSearchbar: boolean = false;
    scrollDirection: string;

    constructor(public navCtrl: NavController,
                  public navParams: NavParams,
                  private storage: Storage,
                  private actionSheetCtrl: ActionSheetController,
                  private modal: ModalController,
                  public loadingCtrl: LoadingController,
                  private customApi: CustomApiProvider,
                  private locationsProvider: LocationsProvider,
                  private changeDetectorRef: ChangeDetectorRef) {
        // Prepare so we can use advanced functions on formInputs
        this.searchControl = new FormControl();
        this.scrollDirection = 'up';
    }

    ionViewWillEnter()
    {
        console.log(' About to show page . ');
        //here we will always make sure to reload the data we need from remote locations.
        // To make sure se show the most current data.
        // in this case just load from locationProvider localy .. which should hold updated data

        //for now just always use re-reload from remote
        //this.getLocations();
        this.locations = [];
        this.getLocations();


    }

    ionViewDidLoad() {
        console.log(' Loaded locationsPage . ');
        this.setFilteredLocations();
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
          this.searching = false;
          this.setFilteredLocations();

        });
        //this.locations = [];
    }

    setFilteredLocations() {

      this.locations = this.locationsProvider.filterLocationsOnAddress(this.searchString);

    }

    onSearchInput(){
      this.searching = true;
    }

    viewLocation(location) {
      this.navCtrl.push(this.locationPage,
          {
              location:location,
              authCustomUser:this.customApi.authCustomUser //pass logged in user to .. so we can use that in view conditions
          })
    }

    addLocation() {
        this.navCtrl.push(this.addLocationPage,
            {
                //Probably wont need any data .. but just keep passing user for now
                authCustomUser:this.customApi.authCustomUser //pass logged in user to .. so we can use that in view conditions
            })
    }

    deleteLocation(location)
    {

      try {
        this.locationsProvider.deleteLocation(location).then(response => {
          console.log('Location deleted: ' +response);
          //update local var with updated list of locations.
          this.locations = this.locationsProvider.getLocations();
        });
      } catch(e) {
        console.log('catch in locationsPage: deleteLocation()  .. :'+e.toString());
      }
    }



    /**
     *
     */
    getLocations() {
        // TODO adjust this to somehow only load locations according to filter
        this.locationsProvider.loadRemoteLocations().then(
            returnedCopyOfLocations => { //a successful connection
                // now locations is loaded in locationsProvider
                // we could use them from there .. or load them to local var
                this.locations = returnedCopyOfLocations;
                //this.loader.dismiss();
              console.log(this.locations);
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

    openSortModal() {
        const sortModal = this.modal.create(ModalSortPage);
        sortModal.present();
    }

    openFilterModal() {
        const filterModal = this.modal.create(ModalFilterPage);
        filterModal.present();
    }

    getScrollPosition(e) {
        this.scrollDirection = e.directionY;
        this.changeDetectorRef.detectChanges();
    }

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Modify your album',
            buttons: [
                {
                    text: 'Destructive',
                    role: 'destructive',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                },{
                    text: 'Archive',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }
}
