// Interface que implementan todos los modelos
import { InterfaceLibrary } from "./InterfaceLibrary";

// Librería para hacer los gráficos
import * as THREE from 'three';

// El diagrama sobre una posición fija
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { auto } from "@popperjs/core";

// jQuery
declare var Parser:any;
declare var $:any;


export class Voronoi implements InterfaceLibrary{
    // El diagrama debería rotar automáticamente?
    private isAutoRotating : boolean = false;

    dateId = new Date();
    idVisualizador = this.dateId.getTime();

    // Template del menú
    menu: string = `
        <div class="form-check mt-4">
            <input class="form-check-input" type="checkbox" value="" id="azul-check">
            <label class="form-check-label" for="azul-check">
              Azul
            </label>
        </div>
        <div class="form-check mt-4">
            <input class="form-check-input" type="checkbox" value="" id="grises-check">
            <label class="form-check-label" for="grises-check">
              Grises
            </label>
        </div>
        <div class="form-check mt-4">
            <input class="form-check-input" type="checkbox" value="" id="auto-rotar-check">
            <label class="form-check-label" for="auto-rotar-check">
              Auto rotar
            </label>
        </div>
        <div class="form-check mt-4">
            <button type="submit" class="btn btn-primary btn-large">Aplicar</button>
        </div>
    `;

    // Lista de elementos
    puntosRed: any[]= [];
    // Lista de colores
    colors: any = {};
  
    // Crear colores
    // TODO: No sé qué hace esto
    setColor (checkbox:any, r:any, g:any, b:any) {
        // Variables auxiliares
        var coloraux, coloraux2, caux;
        
        if (checkbox.checked == true) {     
            this.puntosRed.forEach( (punto) => {
                coloraux = punto.material.color;
                coloraux2 = coloraux.getHex();
                caux = coloraux.r + coloraux.g + coloraux.b;
                coloraux.r = r / caux;
                coloraux.g = g / caux;
                coloraux.b = b / caux;
                punto.material.setValues({color: coloraux});
                this.colors[coloraux.getHex()] = coloraux2;
            });
        } else {
            this.puntosRed.forEach( (punto) => {
                coloraux = punto.material.color;
                caux = this.colors[coloraux.getHex()];              
                punto.material.setValues({ color: caux });
                
            });
            this.colors = {};
        }
    } // FIN setColor(checkbox:any, r:any, g:any, b:any)

    // Dibujar los puntos dados en el JSON
    draw(json: any, c: any): void {
        // Obtenemos los puntos del json
        // p: {x: 0, y: 0, z: 0, sb: 502}
        var puntos = json.p;

        // Crear escena y cámara
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        
        // Crear el canvas
        const renderer = new THREE.WebGLRenderer({ canvas: c });

        // El diagrama se mueve respecto al centro del cubo
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = this.isAutoRotating;

        // Posición inicial de la cámara
        camera.position.set(350,350,350);

        var posiciones: any = {};  // Lista de las posiciones de los puntos
        var cs: any[] = [];  // Lista de los grupos dados por el campo p.sb
        var mx = -10000, my = -10000, mz = -10000;  // Máximas coordenadas
        
        // Recorremos todos los puntos
        puntos.forEach(function (punto:any) {
            // Convertimos las coordenadas a enteros
            var px = parseInt(punto.x);
            var py = parseInt(punto.y);
            var pz = parseInt(punto.z);

            // Los puntos se agrupan con esta propiedad
            var sb = '' + punto.sb

            // Guardamos las sb para saber los grupos que tenemos
            if (!cs.includes(sb)){
                cs.push(sb);
            }

            // Agregamos la posición al diccionario de coordenadas con su grupo
            if (!posiciones[sb]){
                posiciones[sb] = new Array(px, py, pz);
            }else{
                posiciones[sb].push(px, py, pz);
            }

            // Actualizamos las coordenadas máximas
            if (px > mx) mx = px;
            if (py > my) my = py;
            if (pz > mz) mz = pz;

        }); // FIN puntos.forEach()

        // Esto debe cambiar debido al cambio a BufferGeometry
        cs.forEach((csColor) => {
            // Geometría que va contener todos los puntos con el mismo grupo
            var geometry = new THREE.BufferGeometry();

            // NOTE: LUIS: Por alguna razón el render seleccionado no acepta enteros
            // así que los convierto en flotantes
            var positions = Float32Array.from(posiciones[csColor]);

            // Le mandamos al BufferGeometry las coordenadas de los puntos
            // El objeto creado automáticamente convierte un Array en puntos de 3
            // coordenadas
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            // Creamos el color del area
            var pointColor = new THREE.Color( csColor * 111111);

            // Creamos un material para los puntos
            // TODO: El tamaño de los puntos lo puse a proposito para que se vea
            // bien, tal vez sea necesario que sea especificado desde el JSON
            var material = new THREE.PointsMaterial( { size: 2, color: pointColor } );

            // NOTE: LUIS: Si algún día surge un problema puede ser por esta función
            // geometry.computeBoundingSphere();
            
            // Creamos todos los puntos y los agregamos a la escena
            var points = new THREE.Points( geometry, material );
            scene.add(points);
        }); // FIN cs.forEach()

        function resizeCanvasToDisplaySize() {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            if (canvas.width !== width || canvas.height !== height) {
                renderer.setSize(width, height, false);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        }

        function animate(isAutoRotating:any) {
            requestAnimationFrame( animate );
            resizeCanvasToDisplaySize()
            controls.update();
            controls.autoRotate = isAutoRotating
            renderer.render( scene, camera );
        }

        // Calcular el centro del cubo para la rotación
        var centro = new THREE.Vector3();
        centro.x = mx / 2;
        centro.y = my / 2;
        centro.z = mz / 2;
        controls.target = centro;

        // Zoom máximo y mínimo
        controls.minDistance = centro.length();
        controls.maxDistance = 1000;

        animate(this.isAutoRotating);
    } // Fin draw(json: any, c: any)


    // Función para activar/desactivar autoRotate
    toggleAutoRotate(checkbox:any) {
        this.isAutoRotating = checkbox.checked;
        console.log("Toggle Auto Rotate");
        
        // this.draw.animate();
    }

    mostrarMenu(nuevoId:any, stringCanvas='myCanvas'):void {
        // var objParticulas = this.json;
        var mySelf = this;
        mySelf.idVisualizador = nuevoId;
        // var contenedor= "<div class='row' id='visualizador" + mySelf.idVisualizador + "'>"+
        //                     "<div class='container col-sm-10' id='"+ mySelf.idVisualizador + "'></div> " +
        //                     "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu"+ mySelf.idVisualizador + "'></div>" +
        //                 "</div>";

        // var Tau= this.json.tiempos[0].valor.toFixed(2);
        // var Loop= this.json.tiempos[1].valor.toFixed(2);
        // var Direct= this.json.tiempos[2].valor.toFixed(2);

        // if(stringCanvas == 'myCanvas'){//Se coloca para el menuPrincipal
        //     //$('.div-canvas').append(contenedor);
        //     $('#myCanvas').after(contenedor);
        // }else{//si se aislo una particula
        //     //$('.'+stringCanvas).append(contenedor);
        //     $('.'+stringCanvas).after(contenedor);
        // }
        
        // var item = 
        //     "<div id = 'particulasMenu"+mySelf.idVisualizador + "' class='particulasMenuPrincipal' >" +
        //         "<h3 class='align-text-top' id='tituloPrincipal'><span>Menu Particulas</span></h3>"+
        //         "<ul class='nav flex-column'>" +
        //             "<li class='nav-item'>" +
        //                 "<div class='form-check'>" +
        //                     "<button  type='button' class='btn  btn-success button-espacio' id='regresar" +mySelf.idVisualizador+ "'> << </button>"+
        //                     "<button  type='button' class='btn btn-success button-espacio' id='pausa" +mySelf.idVisualizador+ "'> || </button>"+
        //                     "<button  type='button' class='btn btn-success button-espacio' id='avanzar" +mySelf.idVisualizador+ "'> >> </button>"+
        //                     "<div class='form-check'>" +
        //                         "<input type='checkbox' class='form-check-input' id='Checkpt1"+mySelf.idVisualizador+"'>" +
        //                         "<label class='form-check-label' for='exampleCheck1'> Ver Trayectorias</label>" +
        //                     "</div>" +
        //                 "</div>" +
        //             "</li>" +

        //             "<li class='nav-item'>" +
        //                 "<div class='aisla-particula' id='aislaParticula" +mySelf.idVisualizador+ "'>"+
        //                     "<lable> <b>Aislar Particula</b></label>" +
        //                     "<input type='number' min='0' max='4'  size='4' id='particula' placeholder='Elija particula'>" +
        //                     "<button class = 'btn-success' type='submit' id='aceptar'>Aceptar</button>" +
        //                 "</div>" +
        //             "</li>" +
        
        //             "<li class='nav-item'  id='Resultado" +mySelf.idVisualizador+ "'>" +
        //                 "<div class='result'>"+ 
        //                     "<h4>Tiempos</h4>"+
        //                     "<label >Tau Time:</label>"+
        //                     "<input type='text' id='Tau' name='fname' readonly size='5' value='"+Tau+"'><br><br>"+
        //                     "<label >Direct Time:</label> "+
        //                     "<input type='text' id='direcTime'  readonly size='5' value='"+Direct+"'><br><br>"+
        //                     "<label >Looping Time: </label>"+  
        //                     "<input type='text' id='LoopingTime'  readonly size='5' value='"+Loop+"'><br>"+
        //                     "<div class='btn-grafica'>" +
        //                         /*"<button  type='button' class='btn btn-primary' data-toggle='modal' data-target='#exampleModalCenter' id='btngrafica" +mySelf.idVisualizador+ "'>"+
        //                             "Generar grafica" +
        //                         "</button>" +*/
        //                         "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#exampleModal' id='btngrafica" +mySelf.idVisualizador+ "'>"+
        //                             "Launch demo modal"+
        //                         "</button>"+
        //                     "</div>"+
        //                 "</div>"+
        //             "</li>" +
        //         "</ul>" + 
        //     "</div>";
        // //boton            
        // $("#menu" + mySelf.idVisualizador).append(item);
        // $("#menu" + mySelf.idVisualizador).css({ "visibility": "visible", "height": "600px", "width": "250" })
        /************************************************************************************************ */
        var checkAutoRotar = document.getElementById('auto-rotar-check');
        
        //EvenListeners: Se usa Jquery para capturar los eventos
        $('document').ready(
            // $('#pausa' + mySelf.idVisualizador).click(function(){
            //     mySelf.pause();
            // }),

            // $('#regresar' + mySelf.idVisualizador).click(function () {
            //     mySelf.regresar();
            // }),

            // $('#avanzar' + mySelf.idVisualizador).click(function () {
            //     mySelf.avanzar();
            // }),
            //Si el checkbox esta marcado muestra las trayectorias
            // $('#Checkpt1'+mySelf.idVisualizador).change(function(){
            //     if($(objParticulas).is(":checked")){
            //         mySelf.muestraTray(check,mySelf.aislar);
            //     }
            // }),       
            $('#auto-rotar-check').change(function(){
                mySelf.toggleAutoRotate(checkAutoRotar);
            })
      
            // $('#aceptar').click(function(e:any){
            //     var valor = $('#particula').val();
            //     //Si el input es vacio
            //     if( valor == ''){   
            //         e.preventDefault();//No mandamos nada
            //     } else {//En otro caso
            //         //Creasmo la nueva particula
            //         mySelf.aislaParticula(valor);
            //         $('#particula').val('');//Limpiamos el campo para poder ingresar otra particula     
            //     }
            // }),
            //Envento click para el boton que genera la grafica
            // $('#btngrafica' + mySelf.idVisualizador).click(function(){
            //     //Variable que guarda la estructura del modal encargado de mostrar la grafica de la particula
            //     var modalPrueba =
            //                 '<div class="modal h-100 d-flex flex-column justify-content-center" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="display: block">'+
            //                     '<div class="modal-dialog" role="document">'+
            //                         '<div class="modal-content">'+
            //                             '<div class="modal-header">'+
            //                                 '<h5 class="modal-title" id="exampleModalLabel">Modal title</h5>'+
            //                                 '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
            //                                     '<span aria-hidden="true">&times;</span>'+
            //                                 '</button>'+
            //                             '</div>'+
            //                             '<div class="modal-body">'+
            //                                 '...'+
            //                             '</div>'+
            //                             '<div class="modal-footer">'+
            //                                 '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            //                                 '<button type="button" class="btn btn-primary">Save changes</button>'+
            //                             '</div>'+
            //                         '</div>'+
            //                     '</div>'+
            //                 '</div>';

            //     /*var modal = "<div class='modal fade ' id='exampleModalCenter' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>" +
            //                     "<div class='modal-dialog modal-lg' role='document'>"+
            //                         "<div class='modal-content'>"+
            //                             "<div class='modal-header'>"+
            //                                 "<h5 class='modal-title' id='exampleModalLongTitle'>Datos Estadísticos</h5>"+
            //                                 "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
            //                                     "<span aria-hidden='true'>&times;</span>"+
            //                                 "</button>"+
            //                             "</div>"+
            //                             "<div class='modal-body'>"+
            //                                 "<div role='tabpanel'>"+
            //                                     "<!-- Nav tabs -->"+
            //                                     "<ul class='nav nav-tabs' id='myTab' role='tablist'>"+
            //                                         "<li id='bt-char1' class='nav-item'> <a class='nav-link active' data-target='#chart-1' data-toggle='tab'>Histograma de Tiempos</a></li>"+
            //                                         "<li id='bt-char2' class='nav-item'> <a class='nav-link' data-target='#chart-2' data-toggle='tab'>Histograma de Golpes</a></li>"+
            //                                         "<li id='bt-char3' class='nav-item'> <a  class='nav-link' data-target='#chart-3' data-toggle='tab'>Porcentaje de Golpes</a></li>"+
            //                                     "</ul>"+
            //                                     "<!-- Tab panes -->"+
            //                                     "<div class='tab-content'>"+
            //                                         "<div class='tab-pane active' id='chart-1'>"+
            //                                             "<div id='myChart1"+mySelf.idVisualizador+"' style='height: 300px; width: 100%;'></div>"+
            //                                         "</div>"+
            //                                         "<div class='tab-pane' id='chart-2'>"+
            //                                             "<div id='myChart2"+mySelf.idVisualizador+"' style=' height: 300px; width: 100%;'></div>"+
            //                                         "</div>"+
            //                                         "<div class='tab-pane' id='chart-3'>"+
            //                                             "<div id='myChart3"+mySelf.idVisualizador+"' style=' height: 300px; width: 100%;'></div>"+
            //                                         "</div>"+
            //                                     "</div>"+
            //                                 "</div>"+
            //                             "</div>"+
            //                         "</div>"+
            //                     "</div>"+
            //                 "</div>";*/
            //     //Agregamos al DOM el modal
            //     //$('.div-canvas').append(modal);
            //     $('.div-canvas').append(modalPrueba);
            // }),
        );
    }//Fin funcion mostrar menu
}