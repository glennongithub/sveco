import { Injectable } from '@angular/core';
import {location, area} from "../../model/location.model";
import {CustomApiProvider} from "../custom-api/custom-api";
import {LoadingController} from "ionic-angular";
import 'rxjs/add/operator/map';


@Injectable()
export class LocationsProvider {

    private locations:location[];
    private areas:area[];
    loader:any;

    constructor(
        private customApi: CustomApiProvider,
        public loadingCtrl: LoadingController, //adding this to test if I can control spinner popping from here
    ) {

        console.log('constructing Locations Provider');
        //why not always load remote data to local .. if we want to rel on local data
        //this.loadRemoteAreas();
        //this.loadRemoteLocations();
    }

  filterLocationsOnAddress(searchTerm) {
      //if searchterm empty return unfiltered
      if(searchTerm == '')
        return this.getLocations();

      return this.locations.filter((location) => {
        return location.formattedAddressString.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });

  }

    // make async so we always return a promise and can await if we want.
    async addLocation(addedLocation: location, waitForResolve: boolean = true) {
        //make sure to update local copy with it
        this.locations.push(addedLocation);

        // Now do the api-stuff  comment this if we don't use it
        try {
            // then make sure backend is updated to.
            // should return the updated location
            if(waitForResolve) {
                // pop spinner
                let addLoader = this.loadingCtrl.create({
                    content:"Talking to server: adding location",
                });
                //pop overlay
                addLoader.present();
                // wait for com to finish
                addedLocation = await this.customApi.addLocation(addedLocation);
                // remove spinner
                addLoader.dismiss();

            }
            else
                this.customApi.addLocation(addedLocation); //ignoring promise intentionally


        } catch (e) {
            console.log('catch in locations-provider .. addLocation waiting for resolve. :'+e.toString());
        }

        //always return the added location
        return addedLocation;
    }

    async addVisitToLocation(visit, waitForResolve: boolean = true)
    {
        // Due to complexity and not yet decided on how to handle ofline data and relations location/user location/visit/user
        // we do not just tack on to local data first here .. lets update on server first

        // then use returned data to update local locations.

        // first update corresponding item in this master array
        // and take back the updated item.
        let addedVisit;
        let updatedLocation = this.locations.find(this.findItemById, visit.locationId);
        //Now above is useless untill we build code to add visit to this location .. in the right way.
        // TODO .. do above .. but to get going .. skipp for now


        // so send visit
        try {
            // then make sure backend is updated to.
            // should return the updated location
            if(waitForResolve) {
              // pop spinner
              // trying to use a local spinner so we don't dismiss it from somewhere else
              let updateLoader = this.loadingCtrl.create({
                content:"Talking to server",
              });
              //pop overlay
              updateLoader.present();
              // wait for com to finish
              addedVisit = await this.customApi.addVisit(visit);
              // remove spinner
              updateLoader.dismiss();

            }
            else
              this.customApi.addVisit(visit); //ignoring promise intentionally
        } catch(e) {
            console.log('catch in locations-provider .. addVisit waiting for resolve. :'+e.toString());
        }

        // To make suer our local location represent what we added . push the added visit to array of visits for that location
        updatedLocation.visits.push(addedVisit);
        // Find the correct index
        let index = this.locations.indexOf(updatedLocation);

        // Update the actual item in array
        this.locations[index] = updatedLocation;
        //that should do it.. now we do not need to reload everything to see it hopefully

        return addedVisit;

        // fetch specific location .. and update that one in local data .. so all visits is included
    }

    // make async so we always return a promise and can await if we want.
    async updateLocation(location: location, waitForResolve: boolean = true) {
        let updatedLocation;
        // first update corresponding item in this master array
        // and take back the updated item.
        updatedLocation = this.updateLocationInLocations(location);

        // Now do the api-stuff  comment this if we don't use it
            try {
                // then make sure backend is updated to.
                // should return the updated location
                if(waitForResolve) {
                    // pop spinner
                    // trying to use a local spinner so we don't dismiss it from somewhere else
                    let updateLoader = this.loadingCtrl.create({
                        content:"Talking to server",
                    });
                    //pop overlay
                    updateLoader.present();
                    // wait for com to finish
                    updatedLocation = await this.customApi.updateLocation(location);
                    // remove spinner
                    updateLoader.dismiss();

                }
                else
                    this.customApi.updateLocation(location); //ignoring promise intentionally
            } catch (e) {
                console.log('catch in locations-provider .. updateLocation waiting for resolve. :'+e.toString());
            }

        // always return copy of current state of locationsArray
        return updatedLocation;
    }

    getLocations() {
        //if nothing loaded to locations yet. just return empty array
        if (!this.locations)
            return this.locations;
        //else return copy of locations
        return this.locations.slice(); //slice apparently returns a copy instead of a ref.
    }

    getAreas() {
        return this.areas.slice(); //slice apparently returns a copy instead of a ref.
    }

    async loadRemoteLocations() {
        try {
            // pop spinner
            let loadLocationsLoader = this.loadingCtrl.create({
                content:"Talking to server: loading locations",
            });
            //pop overlay
            loadLocationsLoader.present();
            this.locations = await this.customApi.getLocations();
            // remove spinner
            loadLocationsLoader.dismiss();
            return this.getLocations();
        } catch (e) {
            console.log(e.toString())
        }
    }

    async loadRemoteAreas() {
        try {
            // pop spinner
            let loadAreasLoader = this.loadingCtrl.create({
                content:"Talking to server: loading areas",
            });
            //pop overlay
            loadAreasLoader.present();
            this.areas = await this.customApi.getAreas();
            // remove spinner
            loadAreasLoader.dismiss();
            return this.getAreas();
        } catch (e) {
            console.log(e.toString())
        }
    }




    //*************************/
    /* Supportfunctions bellow*/





    // Maybe move this to a separate dateService/provider.. but for now .. just have it here :)

    phpDateObjTojsDateObj(phpDateTimeObject)
    {
      //TODO handle offset .. right now .. we assume 0 so nvm

      return new Date(phpDateTimeObject.timestamp * 1e3 );


    }

    // this is a function that just loops through the array using id to look for the matching item
    // so kind of important function here .. so we know that we can keep the local copy of locations uptodate with what
    // we updated on server via api .. instead of always refetch everything.
    updateLocationInLocations(updatedLocation: location){
        let itemToUpdateFromArray = this.locations.find(this.findItemById, updatedLocation.id);

        // Find the correct index
        let index = this.locations.indexOf(itemToUpdateFromArray);

        // Update the actual item in array
        this.locations[index] = updatedLocation;
        return this.locations[index];
    }

    findItemById(lookingAtItem) {
        return lookingAtItem.id === this;
    }

}
