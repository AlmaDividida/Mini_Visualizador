import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
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
  private archivo!: [string, object];

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
   public loadChartJs( json: object ) {
    console.log("Se abrio correctamente el archivo ChartJS")
  }

}
