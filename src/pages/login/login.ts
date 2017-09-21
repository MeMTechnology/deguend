import { Agentes } from './../../agentes';
import { RemoteService } from './../../providers/remote-service';
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
  agentes: Agentes;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,private auth: AuthService, 
    private alertCtrl: AlertController,private loadingCtrl: LoadingController, private http:Http, private remoteService: RemoteService) {}

  
  public login() {

    this.showLoading();

    this.auth.login(this.registerCredentials).subscribe(allowed => {
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
    console.log('ionViewDidLoad Login');

    this.remoteService.getUsuarios()
                .do(data => this.agentes = data)
                .subscribe((data: Agentes) => this.agentes = data,
                error => console.log(error));
    
    console.log(this.agentes);

  }

}
