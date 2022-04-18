import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { VisualizadorComponent } from './shared/visualizador/visualizador.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CanvasComponent } from './shared/canvas/canvas.component';
import { ModalComponent } from './shared/modal/modal.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';//ng add @ng-bootstrap/ng-bootstrap 12.0.2
import { NgChartsModule } from 'ng2-charts';//npm install ng2-charts --save 3.0.6

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VisualizadorComponent,
    FooterComponent,
    CanvasComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
