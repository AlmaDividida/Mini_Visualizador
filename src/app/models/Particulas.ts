import { InterfaceLibrary } from "./InterfaceLibrary";
import Chart from 'chart.js/auto'
import * as THREE from 'three';

declare var Parser:any;

export class Particulas implements InterfaceLibrary{
    
    private chart: any;//Se usara para crear las graficas
    // Variables que seran usadas para la creación de las particulas
    mySelf = this;
    paso: any = 1;
    particulas:any = 0;
    funciones: any = 0;
    pars: any = [];//particulas (objetos)
    color: any = [];//colores
    trays: any = [];//posiciones de cada particula
    trayso: any = [];//lineas
    colorTrayectoria: any = []; //rreglo para almacenar el color de la trayectoria de una particula aislada
    play: any = false; //Para detener o reanudar la simulacion
    aislar: any = false;//Guarda si la particula es aislada
    numeroParticula: any = null; //Numero de particula que ha sido aislada
    // Se crea la escena sobre la que se pintaran las particulas, ademas de la camara
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    draw(json: any, c: any): void {

        var points: any = [];
        var objParticulas = this.mySelf;
        
        objParticulas.scene.background = new THREE.Color( 0xD3D3D3 );
        const renderer = new THREE.WebGLRenderer({ canvas: c });
        /**
         * Metodo encargado de crear el lugar donde se visualizara la simulacion, este metodo crea
         * -> La escena
         * -> Las paredes del lugar de la visualizacion
         */
        function dibujaCanal() {
            objParticulas.camera.position.set(0, 0, 0.75);
            objParticulas.play = true; //Si la escena se ha creado correctamente podemos comenzar la animacion
            objParticulas.funciones = json.canal;
            var barizq = objParticulas.funciones.LBarrier.value;//Estos valores se obtienen de particulas.json
            var barder = objParticulas.funciones.RBarrier.value;//Estos valores se obtienen de particulas.json

            var xRange = barder - barizq;
            var h = xRange / 1000; //si se requiere mas detalle en las funciones hacer mas pequeño este valor
            var x = barizq;
            var material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 200 });//azul
            var mat2 = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 200 });//rojo

            var formaCanal = new THREE.Shape();

            // definiendo funciones
            var funciont = objParticulas.funciones.TWall.function;//Accedemos a la funcion que se encuentra en el .json
            var tWall = objParticulas.texttoFunction(funciont);//Convierte la función extraida del json a una funcion de javascript
            var funcionb = objParticulas.funciones.BWall.function;
            var bWall = objParticulas.texttoFunction(funcionb);

            //TWALL es la pared superior del canal
            var tgeometry = new THREE.BufferGeometry();
            var p0 = tWall(x);//evalua la función twall en el punto x = 0
            formaCanal.moveTo(x + h, p0); // punto inicial de la forma del canal
            while (x < barder) {
                var y = tWall(x);
                points.push(new THREE.Vector3(x, y, 0));
                tgeometry.setFromPoints(points);
                tgeometry.computeVertexNormals();//#######################
                x += h;
                if (x <= barder) { formaCanal.lineTo(x, y - h); } //menos h para que no tape la linea de la frontera

            }
            if (objParticulas.funciones.TWall.isReflec) {
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
            rgeometry.computeVertexNormals();//#######################
            formaCanal.lineTo(barder - h, y);
            y = bWall(barder);
            points.push(new THREE.Vector3(barder, y, 0));
            rgeometry.setFromPoints(points);
            rgeometry.computeVertexNormals();//#######################
            formaCanal.lineTo(barder - h, y);
            if (objParticulas.funciones.RBarrier.isReflec) {
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
                bgeometry.computeVertexNormals();//#######################
                x -= h;
                if (x >= barizq) { formaCanal.lineTo(x, y + 3 * h); }// mas 3h para que no tape la linea del canal
            }
            if (objParticulas.funciones.BWall.isReflec) {
                var funb = new THREE.Line(bgeometry, material);
            } else {
                var funb = new THREE.Line(bgeometry, mat2);
            }

            //LBarrier, solo cortan en twall y bwall
            y = bWall(barizq);
            var lgeometry = new THREE.BufferGeometry();
            points.push(new THREE.Vector3(barizq, y, 0));
            lgeometry.setFromPoints(points);
            lgeometry.computeVertexNormals();//#######################
            formaCanal.lineTo(barizq + h, y);
            y = tWall(barizq);
            points.push(new THREE.Vector3(barizq, y, 0));
            lgeometry.setFromPoints(points);
            lgeometry.computeVertexNormals();//#######################
            formaCanal.lineTo(barizq + h, y);

            if (objParticulas.funciones.LBarrier.isReflec) {
                var barl = new THREE.Line(lgeometry, material);
            } else {
                var barl = new THREE.Line(lgeometry, mat2);
            }

            //crea canal y agrega a escena, luego agrega barreras del canal
            var cgeometry = new THREE.ShapeGeometry(formaCanal);
            var materialc = new THREE.MeshBasicMaterial({ color: 0x9B9B9B });
            var canal = new THREE.Mesh(cgeometry, materialc);
            objParticulas.scene.add(canal);
            objParticulas.scene.add(funt);
            objParticulas.scene.add(barr);
            objParticulas.scene.add(funb);
            objParticulas.scene.add(barl);
        }//Fin dibuja canal

        /**
         * Metodo encargado de dibujar cada una de las particulas
         */
        function dibujaParticulas() {
            dibujaCanal();
            //Generamos un color pseudoaleatorio
            var color = 1 + objParticulas.numeroParticula * 100;
            //Nos aseguramos que el objeto este vacio
            objParticulas.particulas = {};
            //Si la particula es aislada
            if (objParticulas.aislar) {

                //Leemos las propeidades de archivo JSON
                objParticulas.particulas = json.particles.particle[objParticulas.numeroParticula];
                //Obtenemos solo los pasos de una particula
                var x = objParticulas.particulas.pasos[0].x;
                var y = objParticulas.particulas.pasos[0].y;
                //Creamos las esferas
                var p = new THREE.SphereGeometry(.01,10,10); //(radio, ..., ...)
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
                objParticulas.scene.add(sphere);
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
                    objParticulas.scene.add(sphere);
                    objParticulas.pars.push(sphere);
                    objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
                    color += 100;
                });
            }
            animate(objParticulas.scene, objParticulas);
        }//FIN dibujaParticulas();
        dibujaParticulas();

        function animate(scene: any, objParticulas: any) {
            function avanza() {
                if (objParticulas.play != false) {
                    objParticulas.paso++;
                    objParticulas.setPos(objParticulas.aislar, objParticulas);
                }
                renderer.render(scene, objParticulas.camera);
                requestAnimationFrame(avanza);
            }
            requestAnimationFrame(avanza);
        };//FIN animate(escena,particulas)
    }//FIN draw(json,canvas);

    /**
    * Metodo encargado de guardar cada una de la posiciones de las particulas
    * @params
    * aislar : Indica si la particula sera aislada
    * objParticulas: Es el objeto que contiene toda la informacion de la particula.
    */
    setPos(aislar = false, objParticulas:any): void {

        //Si la particula NO es aislada
        if (aislar == false) {
            /*var pasoID = "pos" + visualizador.id;
            var checkID = "Checkpt1" + visualizador.id;*/

            //Recorremos el arreglo de cada una de las particulas
            for (var i = 0; i < objParticulas.particulas.length; i++) {
                if (objParticulas.paso < objParticulas.particulas[i].pasos.length) {
                    //Guardamos cada posicion
                    var x = parseFloat(objParticulas.particulas[i].pasos[objParticulas.paso].x);
                    var y = parseFloat(objParticulas.particulas[i].pasos[objParticulas.paso].y);
                    //Metemos cada posicion en el arreglo pars 
                    objParticulas.pars[i].position.setX(x);
                    objParticulas.pars[i].position.setY(y);
                    //Guardamos en el arreglo trays cada uno de los puntos
                    objParticulas.trays[i].push({ "x": x, "y": y });
                }
            }
            /*var pasoID = "pos" + visualizador.id;
            var checkID = "Checkpt1" + visualizador.id;
            //Se muestran cada uno de los pasos recorridos en el navegador
            document.getElementById(pasoID).innerHTML = this.paso;
            checkbox = document.getElementById(checkID);*/

            //Si Trayectoria esta marcado, se mostraran las traqyectorias de las particulas
            /*if (checkbox.checked == true) {
                // this.muestraTray(objParticulas);
                objParticulas.muestraTray();
            }*/
        } else {//La particula es aislada, repetimos el procedimiento anterior pero solo para una particula
            if (objParticulas.paso < objParticulas.particulas.pasos.length) {
                var x = parseFloat(objParticulas.particulas.pasos[objParticulas.paso].x);
                var y = parseFloat(objParticulas.particulas.pasos[objParticulas.paso].y);
                objParticulas.pars[0].position.setX(x);
                objParticulas.pars[0].position.setY(y);
                objParticulas.trays[0].push({ "x": x, "y": y });
            }
            /*var pasoID = "pos" + visualizador.id;
            var checkID = "Checkpt1" + visualizador.id;*/

            /*checkbox = document.getElementById(checkID);
            if (checkbox.checked == true) {
                objParticulas.muestraTray();
            }
            document.getElementById(pasoID).innerHTML = this.paso;*/
        }
        // console.log('Desde setPos, aislar = ' + this.aislar + "Visualizador " + visualizador.id);
    }//FIN setPos(aislar,objParticulas)

    /**
    * Metodo encargado de mostrar las trayectoria de cada una de las
    * particulas, funciona para particula aislada y para todo el arreglo
    * de particulas
    */
    muestraTray(): void {
        this.trayso = [];
        var vertices = [];//Puntos que seran unidos para generar la linea de la trayectoria
        let xP = 1000;//Punto en el que la particula cambiara de color su trayectoria

        //if (checkbox.checked == true) {//Posiciones de cada particula
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

                    //var material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors });
                    //var tray = new THREE.Line(geometry, material);
                    //this.scene.add(tray);

                } else { //Si la particula no esta aislada

                    var geometry = new THREE.BufferGeometry();
                    var material = new THREE.LineBasicMaterial({ color: this.color[i] });
                    for (var j = 0; j < this.trays[i].length; j++) {
                        var x = this.trays[i][j].x;
                        var y = this.trays[i][j].y;
                        //geometry.vertices.push(new THREE.Vector3(x, y, 0));

                    }
                    var tray = new THREE.Line(geometry, material);
                    this.scene.add(tray);
                    this.trayso.push(tray);
                }
            }
        //}
    }//FIN muestraTray*/

    //##########################################################################
    // Metodo para pausar la simulacion
    pause():void {
        // console.log('click de: ' + visualizador.id);
        if (this.play == true) {
            this.play = false;
            // console.log(this.play);
        } else {
            this.play = true;
        }
    }

    //regresa 5 pasos
    regresar(): void {
        this.play = false;
        this.paso -= 5;
        this.setPos(this.aislar, this.numeroParticula);
        //this.renderer.render(this.scene, this.camera);
    }

    //avanza 5 pasos
    avanzar():void {
      this.play = false;
      this.paso += 5;
      this.setPos(this.aislar, this.numeroParticula);
      //this.scene.renderer.render(this.scene, this.camera);
    }   
    
    /**
     * Metodo que crea un visulizador nuevo y ademas un menu cuando
     * la particula se aisla
     */
    /*aislaParticula(particula:any, nuevoVisualizador:any):any{
        //Si la particula no existe en el arreglo
        if( particula >= this.particulas.length ){
            //Mensaje de error
            const mensaje = "<div id = 'mensaje'>"+
                                "<h3>Valor inválido</h3>"
                            "</div>";
            //Al presionar el boton aceptar aparecera el mensaje de error
            //y desaperecera despues de 1.5 seg.
            //$('#aceptar').after(mensaje); 
            setTimeout( () => {
                //$('#mensaje').remove();
            },1500 );
            return false;
        }
        this.colorTrayectoria=[];
        //bandera=true para poder observar la visualizacion    
        nuevoVisualizador.bandera = true;

        //Se crea el menu de la particula
        var nuevoItem = "<div class='nuevo' id ='particula"+nuevoVisualizador.id+"'>"+
                            "<div class='row'>"+
                                "<button class='btn btn-block btn-info btn-titulo col-sm-8' disabled>Particula " + particula + "</button>" +
                                "<button class='btn btn-danger btn-titulo col-sm-4' id='quitar"+nuevoVisualizador.id+"'> Quitar </button>" +
                            "</div>"           
                        "</div>";       
                        
        //Se crea el objeto en es te caso de tipo Particula
        object =  eval("new " + json.name + "(nuevoVisualizador,json)");
        //Se indica que la particula sera aislada
        object.aislar = true;
        //Guardamos el numero de la particula que ha sido aislada
        object.numeroParticula = particula;
        //Pasamos el metodo draw() el archivo JSON que contiene la informacion de la particula aislada
        object.draw(json);     
        
        // console.log('nuevoVisualizador' + nuevoVisualizador.id);
        //Agregamos el nuevo visualizador al nevagdor
        $('#visualizador'+nuevoVisualizador.id).before(nuevoItem); 
        $('#aislaParticula'+nuevoVisualizador.id).remove();//Quitamos los elementos que no deben estar en menus hijos
        $('#Resultado'+nuevoVisualizador.id).remove()

        //Con ayuda de Jquery capturamos el evento cuando el usuario desee elminar el visualizador
        //del navegador
        $('#quitar'+nuevoVisualizador.id).click(function(){
            // console.log('click');
            var respuesta = confirm("Desea eliminar el visualizador de particula #" + particula);
            //Si se recibe una respuesta
            if( respuesta ) {
                object = {};
                $('#particula'+nuevoVisualizador.id).remove();
                $('#visualizador'+nuevoVisualizador.id).remove();
            } else {//Si el usuario cancela sólo retornamos false
                return false;
            }
        });
    }//FIN aislarParticula
     
    //EvenListeners: Se usa Jquery para capturar los eventos
    $('document').ready(

        $('#pausa'+visualizador.id).click(function () {
            mySelf.pause();
            console.log(mySelf.aislar+ "aislado");
        }),

        $('#regresar'+visualizador.id).click(function () {
            mySelf.regresar();
        }),

        $('#avanzar'+visualizador.id).click(function () {
            mySelf.avanzar();
        }),
        //Si el checkbox esta marcado muestra las trayectorias
        $('#Checkpt1'+visualizador.id).change(function(){
            if($(this).is(":checked")){
                mySelf.muestraTray();
            }
        }),       
      
        $('#aceptar').click(function(e){
            var valor = $('#particula').val();
            //Si el input es vacio
            if( valor == ''){   
                e.preventDefault();//No mandamos nada
            } else {//En otro caso
                //Creasmo la nueva particula
                mySelf.aislaParticula(valor, new Visualizador());
                $('#particula').val('');//Limpiamos el campo para poder ingresar otra particula     
            }
        }),
        //Envento click para el boton que genera la grafica
        $('#btngrafica'+visualizador.id).click(function(){
            //Variable que guarda la estructura del modal encargado de mostrar la grafica de la particula
            var modal = "<div class='modal fade ' id='exampleModalCenter' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>" +
            "<div class='modal-dialog modal-lg' role='document'>"+
              "<div class='modal-content'>"+
                "<div class='modal-header'>"+
                  "<h5 class='modal-title' id='exampleModalLongTitle'>Datos Estadísticos</h5>"+
                  "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                    "<span aria-hidden='true'>&times;</span>"+
                  "</button>"+
                "</div>"+
                " <div class='modal-body'>"+
                "<div role='tabpanel'>"+
                    "<!-- Nav tabs -->"+

                    "<ul class='nav nav-tabs' id='myTab' role='tablist'>"+
                        "<li id='bt-char1' class='nav-item'> <a class='nav-link active' data-target='#chart-1' data-toggle='tab'>Histograma de Tiempos</a></li>"+
                        "<li id='bt-char2' class='nav-item'> <a class='nav-link' data-target='#chart-2' data-toggle='tab'>Histograma de Golpes</a></li>"+
                        "<li id='bt-char3' class='nav-item'> <a  class='nav-link' data-target='#chart-3' data-toggle='tab'>Porcentaje de Golpes</a></li>"+
                    "</ul>"+

                   " <!-- Tab panes -->"+

                    "<div class='tab-content'>"+
                        " <div class='tab-pane active' id='chart-1'>"+
                            "<div id='myChart1"+visualizador.id+"' style='height: 300px; width: 100%;'></div>"+
                        "</div>"+
                        "<div class='tab-pane' id='chart-2'>"+
                            "<div id='myChart2"+visualizador.id+"' style=' height: 300px; width: 100%;'></div>"+
                        "</div>"+
                        "<div class='tab-pane' id='chart-3'>"+
                            "<div id='myChart3"+visualizador.id+"' style=' height: 300px; width: 100%;'></div>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
           " </div>"+
            "</div>"+
            "</div>"+
          "</div>";

          //Agregamos al DOM el modal
          $('.container-fluid').append(modal);
                    //Arreglos que almacenan los puntos donde toca la particula 
         

        //Obtenemos el canvas que se ha creado en la variable modal, este canvas servira para poder pintar el modal
        //Obtenemos el canvas que se ha creado en la variable modal, este canvas servira para poder pintar el modal
        var Tiempos= []; //Arreglo para almacenar el valor de Tau, directTime, loopingTime
        var Golpes= [];

        let div1 = document.getElementById('myChart1'+visualizador.id);
        let div2 = document.getElementById('myChart2'+visualizador.id);
        let div3 = document.getElementById('myChart3'+visualizador.id); //Creamos un nuevo graficador y pasamos los parametros necesarios
        console.log("Datos"+ json.tiempos[0].nomPared);

        for (var index = 0; index < json.golpes.length; index++) {
            Golpes.push({ "y": json.golpes[index].valor, "label": json.golpes[index].nomPared});
        }
        
        for (var index = 0; index < json.tiempos.length; index++) {
            Tiempos.push({ "y": json.tiempos[index].valor, "label": json.tiempos[index].time});
        }
        
        new graficador(div1, div2, div3, Tiempos, Golpes);
             
         }),

        //NO TOCAR APARTIR DE AQUI!!
    );*/

    //##########################################################################
    texttoFunction(funcion: any) {
        return Parser.parse(funcion).toJSFunction(['x']);
    }
}