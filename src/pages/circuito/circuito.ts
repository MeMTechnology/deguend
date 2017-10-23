import { Formulario } from './../formulario/formulario';
import { NavController, NavParams } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from './../../providers/auth-service';
import { Http} from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-circuito',
  templateUrl: 'circuito.html',
})
export class CircuitoPage {

  directionsService = new google.maps.DirectionsService();
  directionsDisplay: any;
  codAgente: number;
  pontosRoute = "";
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, 
    private http:Http,private geolocation: Geolocation) {
    let info = this.auth.getUserInfo();
    this.codAgente = info['cod'];
    console.log("Agente Cod: "+this.codAgente);
  }

  ionViewDidLoad() {
    this.loadMap();
    this.getDataPoints();
  }

  getDataPoints(){
    this.http.get('http://10.1.3.107:8080/getRouteByAgente/'+this.codAgente).map(res => res.json())
    .subscribe(result => {
    this.pontosRoute = result;
    //console.log("Result: "+JSON.stringify(this.pontosRoute));
    this.loadRoute(result);
    });
  }

  pontosInter(x){
    var intermediarios = [];
    for(var i = 1; i<x.length - 1; i++){
      intermediarios.push(x[i]);
    }
    return intermediarios;
  }

  loadRoute(pontos){
    var myTest =JSON.parse(pontos[0].pontosRota);
    //console.log("TESTE: "+JSON.stringify(myTest));
    this.geraRotaByPoints(myTest);
  }

  geraRotaByPoints(myTest){
		var enderecoPartida = myTest[0].location;
		var enderecoChegada = myTest[myTest.length - 1].location;
    
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

  directionsDisplay.setMap(this.map);
  //Essa linha abaixo é q tava dando pau.
  //directionsDisplay.setPanel(this.directionsPanel.nativeElement);

  directionsService.route({
      origin: enderecoPartida,
      destination: enderecoChegada,
      waypoints: this.pontosInter(myTest),
      travelMode: google.maps.TravelMode.DRIVING
  }, (res, status) => {

      if(status == google.maps.DirectionsStatus.OK){
          directionsDisplay.setDirections(res);
      } else {
          console.warn(status);
      }

  });

	//cleanMarcadores();//Testando...
}

  loadMap(){
       let latLng = new google.maps.LatLng(-22.65918, -45.8532757847999);
    
       let mapOptions = {
         center: latLng,
         zoom: 16,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       }
    
       //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
       this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
       this.directionsDisplay = new google.maps.DirectionsRenderer({
        map: this.map
    });
       this.directionsDisplay.setMap(this.map);
    
     }

     vaiMerda(){
       console.log("Oh shit!");
     }

    addMarker(data){
      let test2 = this.map.getCenter();
      var myLatLng = {lat: data.coords.latitude, lng: data.coords.longitude};
      //let xJon = JSON.parse(test2);
       let marker = new google.maps.Marker({
         map: this.map,
         animation: google.maps.Animation.DROP,
         //position: this.map.getCenter()
         position: myLatLng
       });
      
       //let content = '<h4>Information!</h4>';          
      
       this.addInfoWindow(marker);
      
     }


     addInfoWindow(marker){
       var conteudo = "<button onclick='pushPage()'>Go to Form</button>";
      
       let infoWindow = new google.maps.InfoWindow({
         content: conteudo
       });
      
       google.maps.event.addListener(marker, 'click', () => {
         infoWindow.open(this.map, marker);
         this.navCtrl.push(Formulario);
       });
      
     }

     getLocation(){
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
       }).catch((error) => {
         console.log('Error getting location', error);
       });
       
       let watch = this.geolocation.watchPosition().subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
        //console.log("Long: "+data.coords.longitude);
        //console.log("Lat: "+data.coords.latitude);
        this.addMarker(data);
        watch.unsubscribe();
  
       });
     }

}

function pushPage(){
  console.log("maeaadf");
 this.navCtrl.push(Formulario);
}
