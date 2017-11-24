import { CircuitoPage } from './../circuito/circuito';
import { Http } from '@angular/http';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms'


@Component({
  selector: 'page-formulario',
  templateUrl: 'formulario.html',
})
export class Formulario {

  visita : any ={};
  position : any;
  codRota : any;
  isFocoValue: any = 0;
  isMotivo: any = 0;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, 
    public navParams: NavParams, private http: Http, private alertCtrl: AlertController) {
    this.codRota = navParams.get("codRota");
    this.position = navParams.get("myPosition");
    
 
    this.visita = this.formBuilder.group({
      endereco:['',Validators.required],
      numero:['',Validators.required],
      complemento:['',Validators.required],
      morador:['',Validators.required],
      isFoco:[false,Validators.required],
      descricao:[{value: null, disabled: false}, Validators.required],
      isVisita:[false,Validators.required],
      motivo:[{value: null, disabled: false}, Validators.required]

    }); 
  }

  public notifiy(){
    if(this.visita.controls['isFoco'].value == true){
     // this.visita.controls['descricao'].enable();
      this.isFocoValue = 1;
    }
    else{
      this.visita.controls['descricao'].disable();
      this.isFocoValue = 0;
    }
  
  }

  public notifiyTwo(){
    if(this.visita.controls['isVisita'].value == true){
      //this.visita.controls['motivo'].enable();
      this.isMotivo = 1;
    }
    else{
      this.visita.controls['motivo'].disable();
      this.isMotivo = 0;
    }
  
  }

  public postForm(){
    //console.log("IS FOCO: "+this.visita.value.isFoco.value);
    let data = {
      endereco: this.visita.value.endereco,
      numero: this.visita.value.numero,
      complemento: this.visita.value.complemento,
      morador: this.visita.value.morador,
      isFoco: this.isFocoValue,/* sim = 1 não = 0 */
      descricao: this.visita.value.descricao,
      codRota: this.codRota,
      pontoLocal: this.position,
      isVisita: this.isMotivo,
      motivo: this.visita.value.motivo
    }

    this.http.post('http://localhost:8080/cadastroVisita', data)
      .subscribe(res => {
      console.log(res.json().sim);
      this.avisaEvolta(res.json().sim);
    });
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Formulario');

  }

  avisaEvolta(result){
    let alert;
    if(result == "yes"){
      alert = this.alertCtrl.create({
        title: 'Cadastro Realizado',
        buttons: ['OK']
      });
    }
    else{
      alert = this.alertCtrl.create({
        title: 'Erro!',
        buttons: ['OK']
      });
    }
    alert.present();
    this.navCtrl.pop();
  }

}