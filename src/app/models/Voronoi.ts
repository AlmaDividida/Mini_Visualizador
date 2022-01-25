import { InterfaceLibrary } from "./InterfaceLibrary";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class Voronoi implements InterfaceLibrary{

    mySelf = this;
    puntosRed:any[]= [];
    colors = {};

    draw(json: object, c: any): void {
        console.log("Se abrio correctamente el archivo ChartJS");
        console.log(json);
    }
}