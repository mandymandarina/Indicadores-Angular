import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorsComponent } from './contenedor-indicadores/contenedor-indicadores.component';
import { HistorialIndicadorComponent } from './components/historial-indicador/historial-indicador.component';

const routes: Routes = [
  { path: '', component: IndicatorsComponent },
  { path: 'historial/:indicador', component: HistorialIndicadorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
