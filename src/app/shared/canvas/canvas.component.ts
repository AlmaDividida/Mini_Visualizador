import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js'; //importamos la libreria para usar ChartJS npm install chart.js --save 3.7.0
import datosChart from 'src/assets/json/chartjs.json';//importamos ek json para acceder a sus atributos

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  public chart: any;//guardara el obj chart.js
  public Datos: any = datosChart;//se obtiene el json chartjs.json

  constructor() { }

  ngOnInit(): void {
  }

  chartJs(json?: any): void {
    var xValues = json.data.labels;//["Italy", "France", "Spain", "USA", "Argentina"];
    var yValues = json.data.datasets.data;//[55, 49, 44, 24, 15];
    var barColors = json.data.datasets.backgroundColor;//["red", "green", "blue", "orange", "brown"];
    var tipo = json.type;

    this.chart = new Chart("myCanvas", {
      type: tipo,
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      /*options: {
        legend: {display: true},
        title: {
          display: true,
          text: "World Wine Production 2018"
        }
      }*/
    });
  }

}
