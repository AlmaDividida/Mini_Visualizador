import { InterfaceLibrary } from "./InterfaceLibrary";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class ThreeJs implements InterfaceLibrary {

    draw(json: object, c: any): void {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        
        const renderer = new THREE.WebGLRenderer({ canvas: c });
        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.setZ(5);
        
        const loader = new THREE.ObjectLoader();
    
        const model = loader.parse( json );
        
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
