import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { location, area, visit } from "../../model/location.model";
import {Observable} from "rxjs/Observable";


/**
 * This is an interesting thing .. we benefit from defining the expected interface returned from all api-requests .. so
 * we should probably define those in a specific file .. but start by just tossing them in here now.
 * NOTE .. have started moving to model-folder.  and import from there.
 */
interface WhoAmIResponse {
    username: string;
    key: string;
}

interface getApiKeyResponse {
    username: string;
    fullname: string;
    key: string;
    error: string;
}

/*
 Generated class for the CustomApiProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class CustomApiProvider {



    customApiEndpoint:string;
    customApiUrlPrefix:string;
    customLocalStorageIdentifier:string; /* using this to be able to use unique ids in local storage */
    public authCustomUser:{
        username: string,
        fullname: string,
        apiKey: string
    };

    constructor(public http: HttpClient, private storage: Storage) {
        console.log('Hello CustomApiProvider Provider');
        //always just init the authCustomUser to empty strings
        // the init method should be used to set it to proper values
        this.authCustomUser = {
            username: '',
            fullname: '',
            apiKey: ''
        };
        this.customApiEndpoint = 'https://sveco.test/';
        this.customApiUrlPrefix = 'api/'
        this.customLocalStorageIdentifier = 'authSvecoUser';
    }

    /**
     * This init-method will try to find settings and then connect and see if we manage to authenticate properly
     * if not .. return some form of error code to let main app know what to do
     */
    init() {
        //make it return a promise so we can be sure to wait for result before we pop result error or success
        return new Promise((resolve, reject) => {
            //try to get apiKey from localStorage.
            this.loadCustomUserFromStorageToProvider().then(isOk => {
                if(this.authCustomUser.username != '' && this.authCustomUser.apiKey != '')
                {
                    //try to run who am i
                    this.whoAmI()
                        .subscribe(data => {
                            // let jsonData = data.json(); /* new httpClient return jsonObject as default.. no need to parse it*/
                            let jsonData = data;
                            console.log(jsonData);
                             // TODO fix this
                             if(jsonData.username != this.authCustomUser.username && jsonData.key != this.authCustomUser.apiKey)
                                 reject("Auth don't match .. please reauthorise via settings");
                             else
                                resolve("OK");

                        }, errData => {
                            reject("Connection to server totally failed when running whoami ;( ! Errors was: "+errData.statusText);
                        });
                } else
                    reject("No authorized user found .. going to settings");
            });
        });

    }

    loadCustomUserFromStorageToProvider() {
        return new Promise(resolve => {
            this.storage.get(this.customLocalStorageIdentifier).then((authCustomUserFromStorage) => {
                if(authCustomUserFromStorage == null) {
                    //just set storedUsername to emptyString
                    this.authCustomUser.username = '';
                    this.authCustomUser.apiKey = '';
                    this.authCustomUser.fullname = '';
                } else {
                    //ok .. we got something .. lets se if its something sane
                    let tmpAuthCustomUser = JSON.parse(authCustomUserFromStorage);

                    //only continue if we got som sane values
                    if(tmpAuthCustomUser.username && tmpAuthCustomUser.apiKey)
                    {
                        //now just set these values so we can use in in view .. to show who we think we are
                        //not sure if object are just referenced as in php so copying val by val
                        this.authCustomUser.username = tmpAuthCustomUser.username;
                        this.authCustomUser.apiKey = tmpAuthCustomUser.apiKey;
                        this.authCustomUser.fullname = tmpAuthCustomUser.fullname;

                    } else {
                        //no sane values .. treat as nothing saved
                        this.authCustomUser.username = '';
                        this.authCustomUser.apiKey = '';
                        this.authCustomUser.fullname = '';
                    }
                }
                //as last thing.. resolve to let caller continue
                resolve(true);
            });
        });

    }

    getApiKey(userName: string, password: string) {
        //try to fetch apiKey for passed login-params
        return this.http.get<getApiKeyResponse>(this.customApiEndpoint+'account/generate-api-token?username='+userName+'&password='+password);
    }

    getLocations() {
        let urlToCall:string = this.buildApiUrlForCommand('locations');
        return this.observableToPromise<location[]>(this.http.get<location[]>(urlToCall));
    }

    getAreas(searchString = '') {
        //don't tac on / if no searchstring provided
        searchString = (searchString != '')? '/' + searchString : '';
        let urlToCall:string = this.buildApiUrlForCommand('areas'+ searchString);
        return this.observableToPromise<area[]>(this.http.get<area[]>(urlToCall));
    }

    updateLocation(location) {
        let urlToCall:string = this.buildApiUrlForCommand('location/'+location.id); //TODO pass in as param instead
        return this.observableToPromise<location>(this.http.post<location>(urlToCall, JSON.stringify(location)));
        // To set header ad third param like this ..
        //, {headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
        //    params: new HttpParams().set('id', '3'),}
    }

    addLocation(location)
    {
        let urlToCall:string = this.buildApiUrlForCommand('location');
        console.log('about to post data:'+ JSON.stringify(location));
        return this.observableToPromise<location>(this.http.post<location>(urlToCall, JSON.stringify(location)));
        // To set header ad third param like this ..
        //, {headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
        //    params: new HttpParams().set('id', '3'),}
    }

    deleteLocation(location)
    {
      let urlToCall:string = this.buildApiUrlForCommand('location/'+location.id);
      console.log('about to delete location:'+ JSON.stringify(location));
      return this.observableToPromise<any>(this.http.delete<any>(urlToCall));
    }

    addVisit(visit)
    {
      let urlToCall:string = this.buildApiUrlForCommand('visit');
      console.log('about to post data:'+ JSON.stringify(visit));
      return this.observableToPromise<visit>(this.http.post<visit>(urlToCall, JSON.stringify(visit)));
    }

    deleteVisit(visit)
    {
      let urlToCall:string = this.buildApiUrlForCommand('visit/'+visit.id);
      console.log('about to delete visit:'+ JSON.stringify(visit));
      return this.observableToPromise<any>(this.http.delete<any>(urlToCall));
    }

    buildApiUrlForCommand(command: string, params?:Map<string, string>)
    {

        // the auth is done via passed apikey param
        let urlToConnectTo: string = this.customApiEndpoint+this.customApiUrlPrefix+command+'?apikey='+this.authCustomUser.apiKey;

        /** do this later .. research how to pass this in .. and how to best iterate over them
         if(params)
         {
           for(let param of params)
           {
             urlToconnectTo += ''
           }
         }
         */
        return urlToConnectTo;
    }


    whoAmI()
    {
        let urlToCall:string = this.buildApiUrlForCommand('whoami')
        return this.http.get<WhoAmIResponse>(urlToCall);
    }

    /**
     * Support functions
     *
     */

    /**
     *
     */
    observableToPromise<T>(passedObservable): Promise<T>{
        return new Promise((resolve, reject) => {
            passedObservable.subscribe( //when successfully retrieved data
                data => {
                    resolve(data);
                },
                errData => { //when something went wrong
                    // by returning this on error we can use try catch on the returned promise .. which gives us cleaner code
                    console.log(errData.toString());
                    reject("Connection to server failed ;( ! Errors was: "+errData.statusText);
                }
            )
        });
    }

}
