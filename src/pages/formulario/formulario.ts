import { CircuitoPage } from './../circuito/circuito';
import { Http } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms'


@Component({
  selector: 'page-formulario',
  templateUrl: 'formulario.html',
})
export class Formulario {

  visita : any ={};
  position : any;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams, private http: Http) {
    this.position = navParams.get("myPosition");
    this.visita = this.formBuilder.group({
      endereco:['',Validators.required],
      numero:['',Validators.required],
      complemento:['',Validators.required],
      morador:['',Validators.required],
      isFoco:['',Validators.required],
      descricao:['',Validators.required]

    });
  }

  public postForm(){
    //console.log(this.visita.value);
    console.log("TEST: "+JSON.stringify(this.position));
    let data = this.visita.value;

    this.http.post('http://localhost:8080/cadastroVisita', data)
      .subscribe(res => {
      console.log(res.json());
    });
   
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Formulario');

  }

;

}
