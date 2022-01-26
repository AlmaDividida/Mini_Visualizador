import { InterfaceLibrary } from "./InterfaceLibrary";


export class Particulas implements InterfaceLibrary{
    
    mySelf = this;
    paso = 1;
    particulas = 0;
    funciones = 0;
    pars = [];//particulas (objetos)
    color = [];//colores
    trays = [];//posiciones de cada particula
    trayso = [];//lineas
    colorTrayectoria = []; //rreglo para almacenar el color de la trayectoria de una particula aislada
    play = false; //Para detener o reanudar la simulacion
    aislar = false; //Guarda si la particula es sera aislada
    numeroParticula = null; //Numero de particula que ha sido aislada

    draw(json: object, c: any): void {
        console.log("Se abrio correctamente el archivo Particulas");
        console.log(json);
    }
}