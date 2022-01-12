import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js'; //importamos la libreria para usar ChartJS//BORRAR
import datosChart from 'src/assets/json/chartjs.json';//importamos ek json para acceder a sus atributosBORRAR

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.css']
})
export class VisualizadorComponent implements OnInit {

  file: any | null = null;
  buttonDisabled: boolean = true;
  jsonObj: any | null = null;

  public chart: any;//guardara el obj chart.jsBORRAR
  public Datos: any = datosChart;//se obtiene el json chartjs.jsonBORRAR
  // Inject service 
  constructor(){}

  ngOnInit(): void {
  }

  // OnChange File
  onChange( event:any ) {
    var fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = event.target.files[0];
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }
  
  // OnClick del boton "Subir Archivo" 
  onLoad() {
      var fileToLoad = this.file;
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent){
          var textFromFileLoaded:any = fileLoadedEvent.target?.result;
          var json = JSON.parse(textFromFileLoaded);
          console.log(json)
      };

      fileReader.readAsText(fileToLoad, "UTF-8");
    }
  
    chartJs(json?: any): void {
      json = this.Datos;
      console.log(json);
      var xValues = json.data.labels;//["Italy", "France", "Spain", "USA", "Argentina"];
      console.log(xValues);
      var yValues = json.data.data;//[55, 49, 44, 24, 15];
      console.log(yValues);
      var barColors = json.data.backgroundColor;//["red", "green", "blue", "orange", "brown"];
      console.log(barColors);
      var tipo = json.type;
      console.log(tipo);

      this.chart = new Chart("myCanvas", {
        type: tipo,
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        }
      /*var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
      var yValues = [55, 49, 44, 24, 15];
      var barColors = ["red", "green", "blue", "orange", "brown"];
  
      this.chart = new Chart("myCanvas", {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        }*/
      });
    }//BORRAR
}
