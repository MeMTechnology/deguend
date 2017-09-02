import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CircuitoPage } from './../pages/circuito/circuito';
import { InfoPage } from './../pages/info/info';
import { LoginPage } from './../pages/login/login';

import { AuthService } from './../providers/auth-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  auth:any = AuthService;
  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Circuito', component: CircuitoPage},
      { title: 'Informações', component: InfoPage},
      { title:  'Sair', component: null}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if(page.component){
      this.nav.setRoot(page.component);
    }else{
      Observable.create(observer => {
          this.auth.currentUser = null;
          observer.next(true);
          observer.complete();
      });
      this.nav.setRoot(LoginPage); 
    }
  }
}
