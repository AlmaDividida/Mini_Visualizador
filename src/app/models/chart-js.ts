import { InterfaceLibrary } from "./InterfaceLibrary";
import Chart from 'chart.js/auto' 

export class ChartJs implements InterfaceLibrary{

    draw( json: any, c: any ): void {

        console.log("Se abrio correctamente el archivo ChartJS");
        console.log(json);
        var xValues = json.data.labels;//["Italy", "France", "Spain", "USA", "Argentina"];
        console.log(xValues);
        var yValues = json.data.data;//[55, 49, 44, 24, 15];
        var barColors = json.data.backgroundColor;//["red", "green", "blue", "orange", "brown"];
        var tipo = json.type;
    
        const chart: any = new Chart(c, {
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
