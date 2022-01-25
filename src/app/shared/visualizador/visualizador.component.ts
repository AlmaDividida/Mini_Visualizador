import { Component, OnInit } from '@angular/core';
import { ArchivoService } from 'src/app/services/archivo.service';


@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.css']
})
export class VisualizadorComponent implements OnInit {

  file: any | null = null;
  buttonDisabled: boolean = true;

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
    this.saveStorage();
  }
  
  // OnClick del boton "Subir Archivo" 
  onLoad(): void {
      this.archivoService.setArchivoJson( localStorage.getItem('json') );

  }

  // Guarda el json en el Local Storage
  saveStorage(): void {
    var fileToLoad = this.file;
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded:any = fileLoadedEvent.target?.result;
        var json = JSON.parse(textFromFileLoaded);
        localStorage.setItem('json', textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
  }

}
