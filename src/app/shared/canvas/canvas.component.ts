import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThreeJs } from 'src/app/models/three-js';
import { ChartJs } from 'src/app/models/chart-js';
import { CanvasJs } from 'src/app/models/canvas-js';
import { ArchivoService } from 'src/app/services/archivo.service';
import { RedPorosa } from 'src/app/models/red-porosa';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Voronoi } from 'src/app/models/voronoi';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  showMenu = false;
  menu!: SafeHtml;

  @ViewChild('myCanvas')
  private canvasRef!: ElementRef;
  private archivo!: object;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  constructor(private archivoService:ArchivoService, private sanitizer: DomSanitizer) { }

  /**
   * load
   */
  public load( json: any ) {
    
    const object = this.getConstructor(json.name);
    object.draw(json, this.canvas);
    this.menu = this.sanitizer.bypassSecurityTrustHtml(object.menu);
    this.showMenu = true
  }

  ngOnInit(): void {
    this.archivoService.getArchivoJson$().subscribe(archivo => {
      this.archivo = archivo;
      this.load( this.archivo );
    });
  }

  getConstructor ( name:string ){
    var object:any;

    switch (name) {
      case "ThreeJs":
          object = new ThreeJs();
        break;
      case "CanvasJs":
          object = new CanvasJs();
        break;
      case "ChartJs":
          object = new ChartJs();
        break;
      case "RedPorosa":
        object = new RedPorosa();
        break;
      case "Voronoi":
        object = new Voronoi();
        break;
      case "Particulas":
        object = new RedPorosa();
        break;
      default:
        break;
    }
    return object;
  }

}
