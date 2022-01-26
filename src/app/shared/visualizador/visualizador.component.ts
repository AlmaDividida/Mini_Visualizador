import { Component, OnInit } from '@angular/core';
import { ArchivoService } from 'src/app/services/archivo.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.css']
})
export class VisualizadorComponent implements OnInit {

  file: any | null = null;
  buttonDisabled: boolean = true;

  // Inject service 
  constructor(private archivoService:ArchivoService){}

  ngOnInit(): void { 
  /*
    Visualizador(): void {
      this.mySelf = this;
      this.scene;
      this.group;
      this.camera;
      this.renderer;
      this.controls;
      this.bandera = false;
      this.json;
      var vdate=  new Date();
      this.id= vdate.getTime();
      this.renderer = new THREE.WebGLRenderer();
  
      this.animate = function () {
        //Esta función sólo es uilizada por el diagrama Voronio        
        if (mySelf.bandera != false) {            
            mySelf.controls.update();                                   //controles para mover la camara
            mySelf.renderer.render(mySelf.scene, mySelf.camera);        //tamaño del renderizado de la camara y escena
            // console.log(mySelf.camera);
            requestAnimationFrame(mySelf.animate);
        }
      };
    }
  
    //creacion de la escena de la figura a mostrar
    Visualizador.prototype.creaEscena = function (elemento: any) {   
      var aspect = elemento.clientWidth / elemento.clientHeight;
    
      this.renderer.setSize(elemento.clientWidth -30 , elemento.clientHeight - 20);
  
      //Crea la escena donde se mostrara la visualizacion
      this.scene = new THREE.Scene();
    
      // Será el color de fondo de la escena
      this.scene.background = new THREE.Color(0xD3D3D3);
  
      this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      this.camera.position.set(0, 0, 1);
      elemento.appendChild(this.renderer.domElement);
    }
  */
  }

  // OnChange File
  onChange( event:any ): void {
    var fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = event.target.files[0];
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
    this.saveStorage();
  }
  
  // OnClick del boton "Subir Archivo" 
  onLoad(): void {
      this.archivoService.setArchivoJson( localStorage.getItem('json') );

  }

  // Guarda el json en el Local Storage
  saveStorage(): void {
    var fileToLoad = this.file;
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded:any = fileLoadedEvent.target?.result;
        var json = JSON.parse(textFromFileLoaded);
        localStorage.setItem('json', textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
  }

  /*LIMPIAR CANVAS      https://www.youtube.com/watch?v=CqNhbwNV7RA
  isAviable: boolean
  public width = 900;
  public height = 200;

  public clearZone = () =>{

    this.points= [];
    this.cx.clearRect(0,0,this.width, this.height);
  }
  */
}
