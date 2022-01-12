import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ArchivoService } from 'src/app/archivo.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  @ViewChild('myCanvas')
  private canvasRef!: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  constructor(private archivoService:ArchivoService) { }

  ngOnInit(): void {
    //this.load( this.archivoService.getArchivoJson() ) FALTA IMPLEMENTAR OBSERVABLE
  }

  /**
   * load
   */
  public load( file:[string, object] ) {

    switch (file[0]) {
      case "ThreeJs":
          this.loadThreeJS(file[1]);
        break;
      case "CanvasJs":
          this.loadCanvasJs(file[1]);
        break;
      case "ChartJs":
          this.loadChartJs(file[1]);
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
    
  }

  /**
   * loadCanvasJs
   */
   public loadCanvasJs( json: object ) {
    
  }

  /**
   * loadChartJs
   */
   public loadChartJs( json: object ) {
    
  }

}
