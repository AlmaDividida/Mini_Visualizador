import { InterfaceLibrary } from "./InterfaceLibrary";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class Voronoi implements InterfaceLibrary{
    menu: string =  '<div class="form-check mt-4">' +
                        '<input class="form-check-input" type="checkbox" value="" id="azul-check">' +
                        '<label class="form-check-label" for="azul-check">' +
                          'Azul' +
                        '</label>' +
                    '</div>' +
                    '<div class="form-check mt-4">' +
                        '<input class="form-check-input" type="checkbox" value="" id="grises-check">' +
                        '<label class="form-check-label" for="grises-check">' +
                          'Grises' +
                        '</label>' +
                    '</div>' +
                    '<div class="form-check mt-4">' +
                        '<input class="form-check-input" type="checkbox" value="" id="auto-rotar-check">' +
                        '<label class="form-check-label" for="auto-rotar-check">' +
                          'Auto rotar' +
                        '</label>' +
                    '</div>' +
                    '<div class="form-check mt-4">' +
                      '<button type="submit" class="btn btn-primary btn-large">Aplicar</button>' +
                    '</div>';
    puntosRed: any[]= [];
    colors: any = {};
    
    setColor (checkbox:any, r:any, g:any, b:any) {
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
    }

    draw(json: any, c: any): void {
      var puntos = json.p;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
      
      const renderer = new THREE.WebGLRenderer({ canvas: c });
      const controls = new OrbitControls(camera, renderer.domElement);

      camera.position.set(350,350,350);
      controls.maxDistance = 500;
      controls.maxDistance = 1000;
      var group = new THREE.Group();
      scene.add(group);
    
      // Especifica las figuras y su material
      var colores: any;
      var cs: any[] = [];
      var mx = -10000, my = -10000, mz = -10000;
      puntos.forEach(function (punto:any) {
        console.log(punto)
          var px = parseInt(punto.x);
          var py = parseInt(punto.y);
          var pz = parseInt(punto.z);
          if (!colores.hasOwnProperty('' + punto.sb)) {
              var p = new THREE.BoxGeometry();
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
  
          colores['' + punto.sb].vertices.push(point);
      });
      cs.forEach( (color) => {
          var aux = color * 111111;
          var c = new THREE.PointsMaterial({ color: aux });
          var puntomesh = new THREE.Points(colores['' + color], c);
          group.add(puntomesh);
          this.puntosRed.push(puntomesh);
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
        requestAnimationFrame( animate );
        resizeCanvasToDisplaySize()
        controls.update();
        renderer.render( scene, camera );
      }

      var centro = new THREE.Vector3();
      centro.x = mx / 2;
      centro.y = my / 2;
      centro.z = mz / 2;
      controls.target = centro;
      animate();
    }
}