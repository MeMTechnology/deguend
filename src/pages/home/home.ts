import { LoginPage } from './../login/login';
import { AuthService } from './../../providers/auth-service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  nome = '';
  cpf = '';

  constructor(public navCtrl: NavController, private auth: AuthService) {
    let info = this.auth.getUserInfo;
    this.nome = info['nome'];
    this.cpf = info['cpf'];
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
