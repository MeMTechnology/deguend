import { Agentes } from './../../agentes';
import { Observable } from 'rxjs/Observable';
import { Http} from '@angular/http';
import { HomePage } from './../home/home';
import { AuthService } from './../../providers/auth-service';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  registerCredentials: any = {cpf: '', senha: ''};
  loading: Loading;
  agentes = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams,private auth: AuthService, 
    private alertCtrl: AlertController,private loadingCtrl: LoadingController, private http:Http, ) { }
  
  public login() {

    this.showLoading();

    this.auth.login(this.registerCredentials, this.agentes).subscribe(allowed => {
      if (allowed) {        
        this.navCtrl.setRoot(HomePage);
      } else {
        this.showError("Acesso Negado");
      }
    },
    error => {
      this.showError(error);
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Falha',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
  
  ionViewDidLoad() {

    this.http.get('http://localhost:8080/usuarios').map(res => res.json())
      .subscribe(result => {
      this.agentes = result
      });

  }

}
