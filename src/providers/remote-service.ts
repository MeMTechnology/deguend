import { Injectable } from '@angular/core';
import {Http ,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Agentes } from './../agentes';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';

@Injectable()
export class RemoteService {

  getApiUrl : string = "http://localhost:8080/usuarios/";

  constructor(public http: Http) {  }

  handleError(arg0: any): any {
    throw new Error("Method not implemented.");
  }

  getUsuarios(): Observable<Agentes> {
     return this.http.get (this.getApiUrl)
    .map((response: Response) => <Agentes>response.json())
    .do(data => console.log('All: ' + JSON.stringify(data)))
    .catch(this.handleError);
  }
  
}