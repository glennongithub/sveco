import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
/*this is not added automatically when generating a provider .. but needed :(*/
import { HttpModule } from '@angular/http';  //Not used anymore .. using httpClientModule instead
import { HttpClientModule } from '@angular/common/http';

import { LocationsPage } from '../pages/locations/locations';
import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LocationPage } from '../pages/location/location';


import { ModalErrorPage } from '../pages/modal-error/modal-error';
import { ModalInfoPage } from "../pages/modal-info/modal-info";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CustomApiProvider } from '../providers/custom-api/custom-api';
import {LocationsProvider} from "../providers/locations-provider/locations-provider";
import {GogletestPage} from "../pages/gogletest/gogletest";
import { Geolocation } from '@ionic-native/geolocation';
import { AddLocationPage } from '../pages/add-location/add-location';
import {AddressAutocompletePage} from "../pages/modal-address-autocomplete/addressAutocomplete";
import {ModalAddVisitPage} from "../pages/modal-add-visit/modal-add-visit";
import { ModalSortPage } from '../pages/modal-sort/modal-sort';
import { ModalFilterPage } from '../pages/modal-filter/modal-filter';
import {FaIconComponent} from "../components/fa-icon/fa-icon.component";

@NgModule({
  declarations: [
      MyApp,
      LocationsPage,
      SettingsPage,
      HomePage,
      TabsPage,
      LocationPage,
      ModalErrorPage,
      ModalInfoPage,
      ModalAddVisitPage,
      GogletestPage,
      AddLocationPage,
      AddressAutocompletePage,
      ModalSortPage,
      ModalFilterPage,
      FaIconComponent,
  ],
  imports: [
      BrowserModule,
      IonicModule.forRoot(MyApp),
      HttpModule, /*this is not added automatically when generateing a provider .. but needed :(*/
      HttpClientModule,
      IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LocationsPage,
    SettingsPage,
    HomePage,
    TabsPage,
    LocationPage,
    ModalErrorPage,
    ModalInfoPage,
    ModalAddVisitPage,
    GogletestPage,
    AddLocationPage,
    AddressAutocompletePage,
    ModalSortPage,
    ModalFilterPage,
    FaIconComponent,
  ],
  providers: [
      StatusBar,
      SplashScreen,
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      CustomApiProvider,
      Geolocation,
      LocationsProvider
  ]
})
export class AppModule {}
