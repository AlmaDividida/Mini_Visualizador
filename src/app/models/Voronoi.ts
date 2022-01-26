import { InterfaceLibrary } from "./InterfaceLibrary";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


export class Voronoi implements InterfaceLibrary{

    mySelf = this;
    puntosred = []; //puntos (objetos)
    colors = {}; //colores (hexa)

/*
    //funcion para cambiar el color del vornoi 
    setColor = function (checkbox: any, r: any, g: any, b: any) {
        var coloraux, coloraux2, caux;
        
        if (checkbox.checked == true) {     
            mySelf.puntosred.forEach(function (punto) {
                coloraux = punto.material.color;
                coloraux2 = coloraux.getHex();
                caux = coloraux.r + coloraux.g + coloraux.b;
                coloraux.r = r / caux;
                coloraux.g = g / caux;
                coloraux.b = b / caux;
                punto.material.setValues({color: coloraux});
                mySelf.colors[coloraux.getHex()] = coloraux2;
            });
        } else {
            mySelf.puntosred.forEach(function (punto) {
                coloraux = punto.material.color;
                caux = mySelf.colors[coloraux.getHex()];              
                punto.material.setValues({ color: caux });
                
            });
            mySelf.colors = {};
        }
    }
*/

  
    /**recibe desde index.html el RGB del color a convertir en este caso gris y
    se lo pasa a setColor junto al checkbox que invoco esta funcion**/
    //igual que setGris pero para azul
/*
    //dependiendo de cual checkbox este seleccionado cambia al color y se invoca la funcion setColor
    this.setBlue = function (r, g, b) {
        var checkbox = document.getElementById("checkAzul");            
        mySelf.setColor(checkbox, r, g, b);
    } 
  
    this.setGris = function (r, g, b) {
        var checkbox = document.getElementById("checkGris");      
        mySelf.setColor(checkbox, r, g, b);
    }
  
    //rotacion de derecha a izquierda del voronoi
    this.autoRotar = function (checkbox) {
        if (checkbox.checked == true) {
            // auto rotate
            visualizador.controls.autoRotate = true;
            visualizador.controls.autoRotateSpeed = 5;
        } else {
            visualizador.controls.autoRotate = false;
        }
    }
*/


    draw(json: object, visualizador: any): void {
        console.log("Se abrio correctamente el archivo Voronoi");
        console.log(json);

        
        /**funcion llamada desde index.js recibe un arreglo con las posiciones y color de cada punto
         se crean en conjunto de cada color y se agregan a escena**/
/*
        var puntos = json.p;

        var elemento = document.getElementById(visualizador.id.toString()); //convierte a cadena
        visualizador.creaEscena(elemento);                                  //crea la escena
        visualizador.camera.position.set(350,350,350);                      //posisiona la camara
        visualizador.controls = new OrbitControls(visualizador.camera, visualizador.renderer.domElement);     //hace que el mouse mueva la camara
        visualizador.controls.maxDistance = 500;
        visualizador.controls.maxDistance = 1000;
        var group = new THREE.Group();                                       //crea grupos de objetos
        visualizador.scene.add(group);                                       //los agrega a la escena
        
        //especifica las figuras y su material
        var colores = {};
        var cs = [];
        var mx = -10000, my = -10000, mz = -10000;
        puntos.forEach(function (punto: any) {
            var px = parseInt(punto.x);
            var py = parseInt(punto.y);
            var pz = parseInt(punto.z);
            if (!colores.hasOwnProperty('' + punto.sb)) {
                var p = new THREE.Geometry();
                colores['' + punto.sb] = p;
    
                cs.push(punto.sb);
            }
            var point = new THREE.Vector3();
            point.x = px;
            point.y = py;
            point.z = pz;
            if (px > mx) mx = px;
            if (py > my) my = py;
            if (pz > mz) mz = pz;
    
            colores['' + punto.sb].vertices.push(point);              //añade al final
        });
        cs.forEach(function (color) {
            var aux = color * 111111;
            var c = new THREE.PointsMaterial({ color: aux });
            var puntomesh = new THREE.Points(colores['' + color], c);
            group.add(puntomesh);
            mySelf.puntosred.push(puntomesh);
        });
        
        var centro = new THREE.Vector3();
        centro.x = mx / 2;
        centro.y = my / 2;
        centro.z = mz / 2;
        visualizador.controls.target = centro;
        visualizador.animate();
*/



    }
}