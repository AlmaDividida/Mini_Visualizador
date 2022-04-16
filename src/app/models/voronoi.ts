// Interface que implementan todos los modelos
import { InterfaceLibrary } from "./InterfaceLibrary";

// Librería para hacer los gráficos
import * as THREE from 'three';

// El diagrama sobre una posición fija
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class Voronoi implements InterfaceLibrary{
    // El diagrama debería rotar automáticamente?
    private isAutoRotating : boolean = false;

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

        function animate() {
            requestAnimationFrame( animate );
            resizeCanvasToDisplaySize()
            controls.update();
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

        animate();
    } // Fin draw(json: any, c: any)

}