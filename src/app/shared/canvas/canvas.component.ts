import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ArchivoService } from 'src/app/archivo.service';
//import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Chart } from 'chart.js'; //importamos la libreria para usar ChartJS npm install chart.js --save 3.7.0
//import datosChart from 'src/assets/json/chartjs.json';//importamos ek json para acceder a sus atributos

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  public chart: any;//guardara el obj chart.js
  //public Datos: any = datosChart;//se obtiene el json chartjs.json

  @ViewChild('myCanvas')
  private canvasRef!: ElementRef;
  private archivo!: object;//[string, object];

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  constructor(private archivoService:ArchivoService) { }

  ngOnInit(): void {
    this.archivoService.getArchivoJson$().subscribe(archivo => {
      this.archivo = archivo;
      this.load( this.archivo )
    });
  }

  /**
   * load
   */
  public load( file:any ) {
    switch (file.name) {
      case "ThreeJs":
          this.loadThreeJS(file);
        break;
      case "CanvasJs":
          this.loadCanvasJs(file);
        break;
      case "ChartJs":
          this.loadChartJs(file);
        break;
      default:
          console.log("ERROR NO SE ENCUENTRAN LAS LIBRERIAS DE ESE ARCHIVO")
        break;
    }

  }

  /**
   * loadThreeJS
   */
  public loadThreeJS( json: object ) {
    console.log("Se abrio correctamente el archivo ThreeJS")
  }

  /**
   * loadCanvasJs
   */
   public loadCanvasJs( json: object ) {
    console.log("Se abrio correctamente el archivo CanvasJS")
  }

  /**
   * loadChartJs
   */
   public loadChartJs( json: any ) {
    console.log("Se abrio correctamente el archivo ChartJS");
    console.log(json);
    var xValues = json.data.labels;//["Italy", "France", "Spain", "USA", "Argentina"];
    console.log(xValues);
    var yValues = json.data.data;//[55, 49, 44, 24, 15];
    var barColors = json.data.backgroundColor;//["red", "green", "blue", "orange", "brown"];
    var tipo = json.type;

    this.chart = new Chart("myCanvas", {
      type: tipo,
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      }
    });
  }

}