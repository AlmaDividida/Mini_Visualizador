import { InterfaceLibrary } from "./InterfaceLibrary";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class ThreeJs implements InterfaceLibrary {
    menu: string =  '<div>' +
                      '<label for="customRange2" class="form-label">Aristas</label>' +
                      '<input type="range" class="form-range" min="0" max="5" id="customRange2">' +
                    '</div>' +
                    '<div>' +
                        '<label for="customRange2" class="form-label">Radio</label>' +
                        '<input type="range" class="form-range" min="0" max="5" id="customRange2">' +
                    '</div>' +
                    '<div class="form-check mt-4">' +
                        '<input class="form-check-input" type="checkbox" value="" id="wireframe-check">' +
                        '<label class="form-check-label" for="wireframe-check">' +
                          'Estructura Alámbrica' +
                        '</label>' +
                    '</div>' +
                    '<div class="form-check mt-4">' +
                        '<input class="form-check-input" type="checkbox" value="" id="animation-check">' +
                        '<label class="form-check-label" for="animation-check">' +
                          'Animacion' +
                        '</label>' +
                    '</div>' +
                    '<div class="form-check mt-4">' +
                      '<button type="submit" class="btn btn-primary btn-large">aplicar</button>' +
                    '</div>';

    draw(json: any, c: any): void {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        
        const renderer = new THREE.WebGLRenderer({ canvas: c });
        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.setZ(5);
        
        const loader = new THREE.ObjectLoader();
    
        const model = loader.parse( json.object );
        
        scene.add( model );
    
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
        animate()
    }
    
}
