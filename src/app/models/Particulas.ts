import { InterfaceLibrary } from "./InterfaceLibrary";
import Chart from 'chart.js/auto'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

declare var Parser:any;

export class Particulas implements InterfaceLibrary{
    private chart: any;
    mySelf = this;
    color: any = [];//colores
    paso: any = 1;
    particulas:any = 0;
    funciones: any = 0;
    pars: any = [];//particulas (objetos)
    //var color = [];//colores
    trays: any = [];//posiciones de cada particula
    trayso: any = [];//lineas
    colorTrayectoria: any = []; //rreglo para almacenar el color de la trayectoria de una particula aislada
    play: any = false; //Para detener o reanudar la simulacion
    
    draw(json: any, c: any): void {
        console.log("Se abrio correctamente el archivo Particulas");
        console.log(json);

        var aislar = false; //Guarda si la particula es sera aislada
        var numeroParticula: any = null; //Numero de particula que ha sido aislada

        var points: any = [];
        var objParticulas = this.mySelf;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: c });
        /**
         * Metodo encargado de crear el lugar donde se visualizara la simulacion, este metodo crea
         * -> La escena
         * -> Las paredes del lugar de la visualizacion
         */
        function dibujaCanal() {
            //camera.position.set(0, 0, 1);
            objParticulas.play = true; //Si la escena se ha creado correctamente podemos comenzar la animacion

            objParticulas.funciones = json.canal;
            var barizq = json.canal.LBarrier.value;//Estos valores se obtienen de particulas.json
            var barder = json.canal.RBarrier.value;//Estos valores se obtienen de particulas.json

            var xRange = barder - barizq;
            var h = xRange / 1000; //si se requiere mas detalle en las funciones hacer mas pequeño este valor
            var x = barizq;
            var material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 200 });//azul
            var mat2 = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 200 });//rojo

            var formaCanal = new THREE.Shape();

            // definiendo funciones
            var funciont = json.canal.TWall.function;//Accedemos a la funcion que se encuentra en el .json
            var tWall = texttoFunction(funciont);//Convierte la función extraida del json a una funcion de javascript
            var funcionb = json.canal.BWall.function;
            var bWall = texttoFunction(funcionb);

            //TWALL es la pared superior del canal
            var tgeometry = new THREE.BufferGeometry();
            var p0 = tWall(x);//evalua la función twall en el punto x = 0
            formaCanal.moveTo(x + h, p0); // punto inicial de la forma del canal
            while (x < barder) {
                var y = tWall(x);
                points.push(new THREE.Vector3(x, y, 0));
                tgeometry.setFromPoints(points);
                x += h;
                if (x <= barder) { formaCanal.lineTo(x, y - h); } //menos h para que no tape la linea de la frontera

            }
            if (json.canal.TWall.isReflec) {
                var funt = new THREE.Line(tgeometry, material);//azul
            } else {
                var funt = new THREE.Line(tgeometry, mat2);//rojo
            }

            var y;
            //RBarrier
            y = tWall(barder);
            var rgeometry = new THREE.BufferGeometry();
            points.push(new THREE.Vector3(barder, y, 0));
            rgeometry.setFromPoints(points);
            formaCanal.lineTo(barder - h, y);
            y = bWall(barder);
            points.push(new THREE.Vector3(barder, y, 0));
            rgeometry.setFromPoints(points);
            formaCanal.lineTo(barder - h, y);
            if (json.canal.RBarrier.isReflec) {
                var barr = new THREE.Line(rgeometry, material);
            } else {
                var barr = new THREE.Line(rgeometry, mat2);
            }

            //BWALL
            var bgeometry = new THREE.BufferGeometry();
            x = barder;
            while (x >= barizq - h) {
                var y = bWall(x);
                points.push(new THREE.Vector3(x, y, 0));
                bgeometry.setFromPoints(points);
                x -= h;
                if (x >= barizq) { formaCanal.lineTo(x, y + 3 * h); }// mas 3h para que no tape la linea del canal
            }
            if (json.canal.BWall.isReflec) {
                var funb = new THREE.Line(bgeometry, material);
            } else {
                var funb = new THREE.Line(bgeometry, mat2);
            }

            //LBarrier, solo cortan en twall y bwall
            y = bWall(barizq);
            var lgeometry = new THREE.BufferGeometry();
            points.push(new THREE.Vector3(barizq, y, 0));
            lgeometry.setFromPoints(points);
            formaCanal.lineTo(barizq + h, y);
            y = tWall(barizq);
            points.push(new THREE.Vector3(barizq, y, 0));
            lgeometry.setFromPoints(points);
            formaCanal.lineTo(barizq + h, y);

            if (json.canal.LBarrier.isReflec) {
                var barl = new THREE.Line(lgeometry, material);
            } else {
                var barl = new THREE.Line(lgeometry, mat2);
            }

            //crea canal y agrega a escena, luego agrega barreras del canal
            var cgeometry = new THREE.ShapeGeometry(formaCanal);
            var materialc = new THREE.MeshBasicMaterial({ color: 0x9B9B9B });
            var canal = new THREE.Mesh(cgeometry, materialc);
            scene.add(canal);
            scene.add(funt);//agrega a escena
            scene.add(barr);
            scene.add(funb);
            scene.add(barl);

        }//Fin dibuja canal

        /**
         * Metodo encargado de dibujar cada una de las particulas
         */
        function dibujaParticulas() {
            dibujaCanal();
            //Generamos un color pseudoaleatorio
            var color = 1 + numeroParticula * 100;
            //Nos aseguramos que el objeto este vacio
            objParticulas.particulas = {};
            //Si la particula es aislada
            if (aislar) {

                //Leemos las propeidades de archivo JSON
                objParticulas.particulas = json.particles.particle[numeroParticula];
                //Obtenemos solo los pasos de una particula
                var x = objParticulas.particulas.pasos[0].x;
                var y = objParticulas.particulas.pasos[0].y;
                //Creamos las esferas
                var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                var aux = color * 111111; //Generamos el color
                objParticulas.color.push(aux);//Guardamos el color en el arreglo
                //Asignamos el color a la particula
                var material = new THREE.MeshBasicMaterial({ color: aux });
                //Creamos la esfera y le asignamos su tamaño y color
                var sphere = new THREE.Mesh(p, material);
                //Asignamos las posiciones para la esfera
                sphere.position.x = parseFloat(x);
                sphere.position.y = parseFloat(y);
                //Agregamos la esfera al visualizador         
                scene.add(sphere);
                objParticulas.pars.push(sphere);//Se guarda la particula en el arreglo this.pars = [] 
                //Guardamos las trayectorias de la esfera
                objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
            } else { //Si la particula no es aislada
                objParticulas.particulas = json.particles.particle;//se guarda el arreglo de las particulas del json a la var particulas

                //dibuja particulas y las coloca en la primer posicion
                objParticulas.particulas.forEach(function (particula: any) {//para cada particula se realiza

                    var x = particula.pasos[0].x;
                    var y = particula.pasos[0].y;
                    var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                    var aux = color * 111111;
                    objParticulas.color.push(aux);

                    var material = new THREE.MeshBasicMaterial({ color: aux });
                    var sphere = new THREE.Mesh(p, material);

                    sphere.position.x = parseFloat(x);//convierte a flota la cadena x del json
                    sphere.position.y = parseFloat(y);
                    scene.add(sphere);
                    objParticulas.pars.push(sphere);
                    objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
                    color += 100;
                });
            }
            animate(c, objParticulas);
        }//FIN dibujaParticulas();
        dibujaParticulas();

        function animate(visualizador: any, objParticulas: any) {

            function avanza() {
                if (visualizador.bandera != false) {
                    if (objParticulas.play != false) {
                        objParticulas.paso++;

                        //objParticulas.setPos(objParticulas.aislar, objParticulas);
                        // console.log('me invocaron');
                    }
                    //objParticulas.paso++;
                }
                visualizador.renderer.render(visualizador.scene, visualizador.camera);
                requestAnimationFrame(avanza);
            }
            requestAnimationFrame(avanza);
        };

        function texttoFunction(funcion: any) {
            return Parser.parse(funcion).toJSFunction(['x']);
        }

        /**##################################################################################### */
        /**
         * Metodo encargado de guardar cada una de la posiciones de las
         * particulas
         * @params
         * aislar : Indica si la particula sera aislada
         * objParticulas: Es el objeto que contiene toda la informacion de
         *                la particula.
        */
        /*function setPos(aislar = false, objParticulas:any) {

            //Si la particula NO es aislada
            if (aislar == false) {
                /*var pasoID = "pos" + visualizador.id;
                var checkID = "Checkpt1" + visualizador.id;*/

                //Recorremos el arreglo de cada una de las particulas
                for (var i = 0; i < json.particulas.length; i++) {
                    if (this.paso < this.particulas[i].pasos.length) {
                        //Guardamos cada posicion
                        var x = parseFloat(this.particulas[i].pasos[this.paso].x);
                        var y = parseFloat(this.particulas[i].pasos[this.paso].y);
                        //Metemos cada posicion en el arreglo pars 
                        this.pars[i].position.setX(x);
                        this.pars[i].position.setY(y);
                        //Guardamos en el arreglo trays cada uno de los puntos
                        this.trays[i].push({ "x": x, "y": y });
                    }
                }
                /*var pasoID = "pos" + visualizador.id;
                var checkID = "Checkpt1" + visualizador.id;
                //Se muestran cada uno de los pasos recorridos en el navegador
                document.getElementById(pasoID).innerHTML = this.paso;
                checkbox = document.getElementById(checkID);

                //Si Trayectoria esta marcado, se mostraran las traqyectorias de las particulas
                if (checkbox.checked == true) {
                    // this.muestraTray(objParticulas);
                    this.muestraTray();
                }
            } /*else {//La particula es aislada, repetimos el procedimiento anterior pero solo para una particula
                if (this.paso < this.particulas.pasos.length) {
                    var x = parseFloat(this.particulas.pasos[this.paso].x);
                    var y = parseFloat(this.particulas.pasos[this.paso].y);
                    this.pars[0].position.setX(x);
                    this.pars[0].position.setY(y);
                    this.trays[0].push({ "x": x, "y": y });
                }
                /*var pasoID = "pos" + visualizador.id;
                var checkID = "Checkpt1" + visualizador.id;

                checkbox = document.getElementById(checkID);
                if (checkbox.checked == true) {
                    this.muestraTray();
                }
                document.getElementById(pasoID).innerHTML = this.paso;
            }
            // console.log('Desde setPos, aislar = ' + this.aislar + "Visualizador " + visualizador.id);
        }//FIN setPos
        */
        /**
         * Metodo encargado de mostrar las trayectoria de cada una de las
         * particulas, funciona para particula aislada y para todo el arreglo
         * de particulas
         */
        /*function muestraTray() {

            this.trayso = [];
            var vertices = [];//Puntos que seran unidos para generar la linea de la trayectoria

            let xP = 1000;//Punto en el que la particula cambiara de color su trayectoria
            // console.log(this.aislar);
            if (checkbox.checked == true) {//Posiciones de cada particula
                for (var i = 0; i < this.trays.length; i++) {

                    if (this.trays.length == 1) {//Si la particula esta aislada
                        var geometry = new THREE.BufferGeometry();
                        var colorLinea = [];
                        for (var j = 0; j < this.trays[i].length; j++) {
                            var x = this.trays[i][j].x;
                            var y = this.trays[i][j].y;
                            vertices.push(x, y, 0);
                            if (j < xP) {
                                // Color de la linea: Rojo
                                colorLinea.push(255, 0, 0);
                            } else {
                                // Color de la linea: Blanco
                                colorLinea.push(51, 255, 85);
                            }
                        }

                        //Pasamos las posiciones
                        geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                        // Pasamos el color
                        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colorLinea, 3));

                        var material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors });
                        var tray = new THREE.Line(geometry, material);
                        visualizador.scene.add(tray);

                    } else { //Si la particula no esta aislada

                        var geometry = new THREE.BufferGeometry();
                        var material = new THREE.LineBasicMaterial({ color: this.color[i] });
                        for (var j = 0; j < this.trays[i].length; j++) {
                            var x = this.trays[i][j].x;
                            var y = this.trays[i][j].y;
                            geometry.vertices.push(new THREE.Vector3(x, y, 0));

                        }
                        var tray = new THREE.Line(geometry, material);
                        scene.add(tray);
                        this.trayso.push(tray);
                    }
                }
            }
        }//FIN muestraTray*/
    }
}