import { Formulario } from './../formulario/formulario';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
   myMark : any;
   testPosition : any;
   markerTest: any;
   myPosition: any;
   codRota: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, 
    private http:Http,private geolocation: Geolocation, public alertCtrl: AlertController) {
    let info = this.auth.getUserInfo();
    this.codAgente = info['cod'];
    //console.log("Agente Cod: "+this.codAgente);
  }

  ionViewDidLoad() {
    this.myMark = null;
    this.loadMap();
    this.getDataPoints();
  }

  getDataPoints(){
    this.http.get('http://localhost:8080/getRouteByAgente/'+this.codAgente).map(res => res.json())
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
    this.codRota = pontos[0].cod;
    var myTest =JSON.parse(pontos[0].pontosRota);
    this.testPosition = myTest;
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
    

    addMarker(data){
      let test2 = this.map.getCenter();
      var myLatLng = {lat: data.coords.latitude, lng: data.coords.longitude};
      this.myMark = myLatLng;
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
       //var conteudo = "<button onclick='pushPage()'>Go to Form</button>";
      
       /*let infoWindow = new google.maps.InfoWindow({
         content: conteudo
       });*/
      
       google.maps.event.addListener(marker, 'click', () => {
        // infoWindow.open(this.map, marker);
         this.pushPageFunction();
       });
      
     }

     getLocation(){
      
      //this.navCtrl.push(Formulario, {codRota: this.codRota, myPosition: {"lat":-22.2198788,"lng":-45.916122599999994}});
      /**  */
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
       }).catch((error) => {
         console.log('Error getting location', error);
       });
       
       let watch = this.geolocation.watchPosition().subscribe((data) => {
       
        this.addMarker(data);
        watch.unsubscribe();
  
       });
     }

     presentAlert(){
       /*Essa função pega minha minha posição atual e compara a distância que estou da rota.
       Se estiver suficientemente perto da rota, o IF me deixa ir para o formulário, senão aparece 
       uma mensagem de aviso
       */
      let alert = this.alertCtrl.create({
        title: 'Está fora da Rota',
        buttons: ['OK']
      });
      alert.present();
     }

      pushPageFunction(){
      //FONTE:
      //https://developers.google.com/maps/documentation/javascript/geometry#isLocationOnEdge
      this.myPosition = new google.maps.LatLng(this.myMark.lat, this.myMark.lng);
      console.log("My Position: "+JSON.stringify(this.myPosition));
      
      let i;
      let t1 = [];
      let myPath = '{"path":[';
      for (i =0; i < this.testPosition.length; i++){
        t1.push(new google.maps.LatLng(this.testPosition[i].location.lat,this.testPosition[i].location.lng));
        myPath += JSON.stringify(t1[i]);
        if(i == this.testPosition.length -1)
          continue;
        myPath += ", ";
      }
      myPath +="]}";

      let cascadia = new google.maps.Polyline(JSON.parse(myPath));

      //console.log("Lets see!!"+JSON.stringify(cascadia)+ "  END");

      //A função retorna true se a distância entre o ponto e o ponto mais próximo na linha ou borda 
      //está dentro da tolerância especificada. A tolerância padrão é 10-9 graus.

      //COMENTAR O IF-ELSE PARA DESABILITAR A VALIDAÇÃO DE POSIÇÃO
      if(google.maps.geometry.poly.isLocationOnEdge(this.myPosition, cascadia, 1e-3)){//1e-4 tá bom. 1e-5 é muito perto.
        //1e-5 equivale a 0,00001. Quanto maior é o número maior é o alcance
        console.log("Dentro do Limite:");
        this.navCtrl.push(Formulario, {codRota: this.codRota, myPosition: this.myPosition});
      }
      else{
        this.presentAlert();

      }
      
      //this.navCtrl.push(Formulario, {codRota: this.codRota, myPosition: this.myPosition});
      //this.navCtrl.push(Formulario, {myPosition: {"lat":-22.2198788,"lng":-45.916122599999994}});
      
     }

}

