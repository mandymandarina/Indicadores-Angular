import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndicatorsComponent } from './contenedor-indicadores/contenedor-indicadores.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndicadoresModalComponent } from './components/indicadores.modal/indicadores-modal.component';
import { HistorialIndicadorComponent } from './components/historial-indicador/historial-indicador.component';
import { GraficoIndicadorComponent } from './components/grafico-indicador/grafico-indicador.component';

@NgModule({
  declarations: [
    AppComponent,
    IndicatorsComponent,
    IndicadoresModalComponent,
    HistorialIndicadorComponent,
    GraficoIndicadorComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
