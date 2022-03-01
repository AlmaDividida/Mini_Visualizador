import { InterfaceLibrary } from "./InterfaceLibrary";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Voronoi implements InterfaceLibrary{

    colors = {};

    draw(json: any, c: any): void {

        var puntosred = [];

        var puntos = json.p;
        /**funcion llamada desde index.js recibe un arreglo con las posiciones y color de cada punto
           se crean en conjunto de cada color y se agregan a escena**/
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
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
            var points = [];
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
            points.push(point);//###########
            if (px > mx) mx = px;
            if (py > my) my = py;
            if (pz > mz) mz = pz;

            //scene.add(colores['' + punto.sb]);
            const vertices = new Float32Array([point.x, point.y, point.z]);
            colores['' + punto.sb].setAttribute('position', new THREE.BufferAttribute(vertices,3));
            colores['' + punto.sb].setFromPoints(points);
            colores['' + punto.sb].computeVertexNormals();
            const mesh = new THREE.Points(colores['' + punto.sb], new THREE.MeshNormalMaterial());
            scene.add(mesh);
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