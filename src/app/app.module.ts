import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { LoginPage } from './../pages/login/login';
import { HomePage } from '../pages/home/home';
import { CircuitoPage } from './../pages/circuito/circuito';
import { FormularioPage } from './../pages/formulario/formulario';
import { InfoPage } from './../pages/info/info';

import { AuthService } from './../providers/auth-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    CircuitoPage,
    InfoPage,
    FormularioPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    CircuitoPage,
    InfoPage,
    FormularioPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
