import { InterfaceLibrary } from "./InterfaceLibrary";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Component } from "@angular/core";


export class RedPorosa implements InterfaceLibrary{

    mySelf = this;
    redporosa = [];
    colorsp = {};

    draw(json: any, visualizador: any): void {
        console.log("Se abrio correctamente el archivo Red Porosa");
        console.log(json);
      //
        var elemento = document.getElementById(visualizador.id.toString());       
        visualizador.creaEscena(elemento);
        visualizador.camera.position.set(350, 350, 700);    

        //scene.setValues( {background:''} );
        visualizador.controls = new OrbitControls( visualizador.camera, visualizador.renderer.domElement );
        visualizador.controls.enableDamping = true;
        visualizador.controls.dampingFactor = 0.25;
        visualizador.controls.minDistance = 25;
        visualizador.controls.maxDistance = 100;

        var group = new THREE.Group();
        visualizador.scene.add(group);
        //var colores = json.sitiosColor;
        var puntos = json.sitios;
        var x,y,z,radio,rotacion,radiomax = -1;
        var mx=-1000,my=-1000,mz=-1000;
        var minx=1000,miny=1000,minz=1000;

        for(var i = 0; i < puntos.length; i++){
            x=puntos[i].x;
            y=puntos[i].y;
            z=puntos[i].z;
            if(x>mx) mx=x;
            if(x<minx) minx=x;
            if(y>my) my=y;
            if(y<miny) miny=y;
            if(z>mz) mz=z;
            if(z<minz) minz=z;
            radio=puntos[i].r;
            if(radio>radiomax){
              radiomax=radio;
            }
            rotacion=puntos[i*5+4];
            var p = new THREE.SphereGeometry(radio, 10,10);
            if(puntos[i].color==0){
              var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
            }else if(puntos[i].color==1){
              var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            }else if(puntos[i].color==2){
              var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
            }
            /*
            var sphere = new THREE.Mesh( p, material );
            sphere.position.x = parseInt(x);
            sphere.position.y = parseInt(y);
            sphere.position.z = parseInt(z);
            visualizador.scene.add( sphere );
            this.mySelf.redporosa.push(sphere);
            */
          }
      //
    }
}