import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';//BAR
import DatalabelsPlugin from 'chartjs-plugin-datalabels';//PIE
import { ArchivoService } from 'src/app/services/archivo.service';

declare var $:any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit{

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  constructor(public modal:NgbModal, private archivoService: ArchivoService) { }
  archivo:any;

  public barChartTypeTiempos: ChartType = 'bar';
  public barChartDataTiempos: ChartData<'bar'> = {
    labels: [ ],
    datasets: [
      { data: [] , "label": ""}
    ]
  };

  public barChartTypeGolpes: ChartType = 'bar';
  public barChartDataGolpes: ChartData<'bar'> = {
    labels: [ ],
    datasets: [
      { data: [ ] , "label": ""}
    ]
  };

  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ ],
    datasets: [ {
      data: []
    } ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };

  public barChartPlugins = [ DataLabelsPlugin ];
  public pieChartPlugins = [ DatalabelsPlugin ];

  ngOnInit(): void { 
    /*this.archivoService.getArchivoJson$().subscribe(archivo => {
      this.archivo = archivo;
      console.log(this.archivo);
    });*/
    this.archivo = this.archivoService.archivoJson;
    this.barChartDataTiempos = {
      labels: [ this.archivo.tiempos[0].time, this.archivo.tiempos[1].time, this.archivo.tiempos[2].time ],
      datasets: [
        { data: [this.archivo.tiempos[0].valor,this.archivo.tiempos[1].valor,this.archivo.tiempos[2].valor] , "label": "TIEMPOS"}
      ]
    };

    this.barChartDataGolpes = {
      labels: [ this.archivo.golpes[0].nomPared, this.archivo.golpes[1].nomPared, this.archivo.golpes[2].nomPared ],
      datasets: [
        { data: [this.archivo.golpes[0].valor,this.archivo.golpes[1].valor,this.archivo.golpes[2].valor] , "label": "GOLPES"}
      ]
    };

    this.pieChartData = {
      labels: [ this.archivo.golpes[0].nomPared, this.archivo.golpes[1].nomPared, this.archivo.golpes[2].nomPared ],
      datasets: [ {
        data: [this.archivo.golpes[0].valor,this.archivo.golpes[1].valor,this.archivo.golpes[2].valor]
      } ]
    };
  }
  
  public cambiaGrafica(): void {
    $("document").ready(
      $('#bt-char1').click("shown.bs.tab",function() {
        //activamos la grafica
        $('#chart-1').addClass('active');
        //Eliminamos las demas
        $('#chart-2').removeClass('active');
        $('#chart-3').removeClass('active');
      }),
      $('#bt-char2').click("shown.bs.tab", function() {
        console.log("voy a cambiar de grafica 2")
        $('#chart-2').addClass('active');
        //Eliminamos las demas
        $('#chart-1').removeClass('active');
        $('#chart-3').removeClass('active');
      }),
      $('#bt-char3').click("shown.bs.tab", function() {
        console.log("voy a cambiar de grafica 3")
        $('#chart-3').addClass('active');
        //Eliminamos las demas
        $('#chart-2').removeClass('active');
        $('#chart-1').removeClass('active');
        $('.modal-body').css('overflow-y', 'auto');
        $('.modal-body').css('max-height', $(window).height() * 0.7);
        $('.modal-body').css('height', $(window).height() * 0.7);
      }),
    );
  }

}
