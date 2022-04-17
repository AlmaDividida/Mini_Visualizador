import { Component, OnInit } from '@angular/core';
import { ArchivoService } from 'src/app/services/archivo.service';

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.css']
})
export class VisualizadorComponent implements OnInit {

  file: any | null = null;
  json: any;
  buttonDisabled: boolean = true;
  json: any | null = null;

  // Inject service 
  constructor(private archivoService:ArchivoService){}

  ngOnInit(): void {

  }

  // OnChange File
  onChange( event:any ): void {
    var fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = event.target.files[0];
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
    this.saveStorage(this);
  }
  
  // OnClick del boton "Subir Archivo" 
  onLoad(): void {
<<<<<<< HEAD
    console.log(this.json);
      this.archivoService.setArchivoJson( this.json );

  }

  // Guarda el json en el Local Storage
  saveStorage(callback: any): void {
=======
      this.archivoService.setArchivoJson( this.json );
  }

  // Guarda el json en el Local Storage
  saveStorage(callback:any): void {
>>>>>>> origin/Angel
    var fileToLoad = this.file;
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded:any = fileLoadedEvent.target?.result;
        var json = JSON.parse(textFromFileLoaded);
        callback.json = json;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
  }

}
