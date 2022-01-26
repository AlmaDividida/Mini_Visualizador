import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThreeJs } from 'src/app/models/three-js';
import { ChartJs } from 'src/app/models/chart-js';
import { CanvasJs } from 'src/app/models/canvas-js';
import { ArchivoService } from 'src/app/services/archivo.service';
import { InterfaceLibrary } from 'src/app/models/InterfaceLibrary';
import { Particulas } from 'src/app/models/Particulas';
import { RedPorosa } from 'src/app/models/RedPorosa';
import { Voronoi } from 'src/app/models/Voronoi';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  @ViewChild('myCanvas')
  private canvasRef!: ElementRef;
  private archivo!: object;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  constructor(private archivoService:ArchivoService) { }

  /**
   * load
   */
  public load( json: any ) {
    var object:any;

    switch (json.name) {
      case "ThreeJs":
          object = new ThreeJs();
        break;
      case "CanvasJs":
          object = new CanvasJs();
        break;
      case "ChartJs":
          object = new ChartJs();
        break;
      case "Particulas":
          object = new Particulas();
      break;
      case "RedPorosa":
          object = new RedPorosa();
      break;
      case "Voronoi":
          object = new Voronoi();
      break;
      default:
        break;
    }
    object.draw(json, this.canvas);

  }

  ngOnInit(): void {
    this.archivoService.getArchivoJson$().subscribe(archivo => {
      this.archivo = archivo;
      this.load( this.archivo );
    });
  }

}
