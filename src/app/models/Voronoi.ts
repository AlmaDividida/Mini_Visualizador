import { InterfaceLibrary } from "./InterfaceLibrary";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import { Geometry } from 'three/examples/jsm/deprecated/Geometry';

export class Voronoi implements InterfaceLibrary{

    //puntosred:any = [];
    colors = {};
    //mySelf = this;
    draw(json: any, c: any): void {
        console.log("Se abrio correctamente el archivo Voronoi");
        console.log(json);

        var puntosred = [];

        var puntos = json.p;
        /**funcion llamada desde index.js recibe un arreglo con las posiciones y color de cada punto
           se crean en conjunto de cada color y se agregan a escena**/
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        //const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const camera = new THREE.PerspectiveCamera(55, 1, 1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: c });
        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 1);
        controls.maxDistance = 500;
        controls.maxDistance = 1000;
        var group = new THREE.Group();
        scene.add(group);

        //especifica las figuras y su material
        var colores: any = {};
        var cs: any = [];
        var mx = -10000, my = -10000, mz = -10000;
        puntos.forEach(function (punto: any) {
            var px = parseInt(punto.x);
            var py = parseInt(punto.y);
            var pz = parseInt(punto.z);
            if (!colores.hasOwnProperty('' + punto.sb)) {
                //var p = new THREE.Geometry();
                var p = new THREE.BufferGeometry();
                colores['' + punto.sb] = p;

                cs.push(punto.sb);
            }
            var point = new THREE.Vector3();
            point.x = px;
            point.y = py;
            point.z = pz;
            //point.normalize();
            //const vertices = new Float32Array([point.x, point.y, point.z]);
            if (px > mx) mx = px;
            if (py > my) my = py;
            if (pz > mz) mz = pz;
            const vertices = new Float32Array([point.x, point.y, point.z]);
            colores['' + punto.sb].setAttribute('position', new THREE.BufferAttribute(vertices,3));
            
            /*const material = new THREE.MeshNormalMaterial();
            colores['' + punto.sb].computeVertexNormals();
            const mesh = new THREE.Mesh(colores['' + punto.sb], material);
            scene.add(mesh);*/
        });

        cs.forEach(function (color: any) {
            var aux = color * 111111;
            var c1 = new THREE.PointsMaterial({ color: aux });
            var puntomesh = new THREE.Points(colores['' + color], c1);
            group.add(puntomesh);
            puntosred.push(puntomesh);
        });
        
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
            requestAnimationFrame(animate);
            resizeCanvasToDisplaySize()
            controls.update();
            renderer.render(scene, camera);
        }

        var centro = new THREE.Vector3();
        centro.x = mx / 2;
        centro.y = my / 2;
        centro.z = mz / 2;
        controls.target = centro;
        animate();

    }
}