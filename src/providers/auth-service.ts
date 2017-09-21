import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";


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

  public login(credentials) {

     if (credentials.cpf === null || credentials.senha === null) {
       return Observable.throw("Insira os dados");
     } else {
       return Observable.create(observer => {
         // At this point make a request to your backend to make a real check
         let access = (credentials.senha === "matheus" && credentials.cpf == 13400445606);
         this.currentUser = new User(credentials.cpf, 'matheus');
         console.log(this.currentUser.cpf);
         observer.next(access);
         observer.complete();
       });
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
