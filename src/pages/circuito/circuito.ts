import { NavController, NavParams } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from './../../providers/auth-service';
import { Http} from '@angular/http';

declare var google;

@Component({
  selector: 'page-circuito',
  templateUrl: 'circuito.html',
})
export class CircuitoPage {

  codAgente: number;
  pontosRoute = "";
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private http:Http,) {
    let info = this.auth.getUserInfo();
    this.codAgente = info['cod'];
    console.log("Agente Cod: "+this.codAgente);
  }

  ionViewDidLoad() {
    this.loadMap();
    this.loadRoute();
  }

  loadRoute(){
    this.http.get('http://localhost:8080/getRouteByAgente/'+this.codAgente).map(res => res.json())
    .subscribe(result => {
    this.pontosRoute = result;
    console.log("Result: "+JSON.stringify(this.pontosRoute));
    });
  }

  loadMap(){
    
       let latLng = new google.maps.LatLng(-22.65918, -45.8532757847999);
    
       let mapOptions = {
         center: latLng,
         zoom: 16,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       }
    
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
     }

    addMarker(){
      
       let marker = new google.maps.Marker({
         map: this.map,
         animation: google.maps.Animation.DROP,
         position: this.map.getCenter()
       });
      
       let content = "<h4>Information!</h4>";          
      
       this.addInfoWindow(marker, content);
      
     }

     addInfoWindow(marker, content){
      
       let infoWindow = new google.maps.InfoWindow({
         content: content
       });
      
       google.maps.event.addListener(marker, 'click', () => {
         infoWindow.open(this.map, marker);
       });
      
     }

}
