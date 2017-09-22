import { Agentes } from './../agentes';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx'


export class User {
  nome: string;
  cpf: number;
 
  static logout(): any {
      throw new Error("Method not implemented.");
  }

  constructor(cpf: number, nome: string) {
    this.nome = nome;
    this.cpf = cpf;
  }

}

@Injectable()
export class AuthService {

  currentUser: User;

  public login(credentials, agentes) {


      if (credentials.cpf === null || credentials.senha === null) {
        return Observable.throw("Insira os dados");
      } else {

        for(let i = 0; i < agentes.length; i++){
          
          let str = agentes[i].cpf;
          let cpfStr = credentials.cpf.toString();
      
          str = str.replace(/[!@#$%^&*.-]/g,"");

          if(credentials.senha === agentes[i].senha && cpfStr === str){
            return Observable.create(observer => {
            // At this point make a request to your backend to make a real check
            let access = (credentials.senha === agentes[i].senha && cpfStr === str);
            this.currentUser = new User(credentials.cpf, agentes[i].nome);
            console.log(this.currentUser);
            observer.next(access);
            observer.complete();
            });
          }
        }

        return Observable.throw("Dados incorretos");

      }
     
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

}
