import { Component, OnInit } from '@angular/core';
import { IndicadoresService } from '../services/indicadores.service';

@Component({
  selector: 'app-indicators',
  templateUrl: './contenedor-indicadores.component.html',
  styleUrls: ['./contenedor-indicadores.component.css']
})
export class IndicatorsComponent implements OnInit {
  indicadores: any[] = [];
  cargando: boolean = true;
  errorApi: boolean = false;
  indicadorSeleccionado: any = null;
  modalAbierto: boolean = false;
  datosHistoricos: any[] = []; 
  
  indicadoresDisponibles = ['uf', 'dolar', 'euro', 'utm', 'ipc'];

  constructor(private indicadoresService: IndicadoresService) {}

  ngOnInit(): void {
    let solicitudesPendientes = this.indicadoresDisponibles.length;
    let indicadoresExitosos = 0;

    this.indicadoresDisponibles.forEach(indicador => {
      this.indicadoresService.getIndicador(indicador).subscribe(
        data => {
          const key = Object.keys(data)[0];
          const valores = data[key];

          if (valores && valores.length > 0) {
            this.indicadores.push({
              nombre: key.replace(/s$/, '').toUpperCase(),
              valor: valores[0].Valor || 'N/A',
              fecha: valores[0].Fecha || 'N/A'
            });
            indicadoresExitosos++;
          }

          solicitudesPendientes--;
          if (solicitudesPendientes === 0) {
            this.cargando = false;
            this.errorApi = indicadoresExitosos === 0;
          }
        },
        error => {
          console.error(`Error al obtener ${indicador}:`, error);
          solicitudesPendientes--;
          if (solicitudesPendientes === 0) {
            this.cargando = false;
            this.errorApi = indicadoresExitosos === 0;
          }
        }
      );
    });
  }

  nombreCompleto(indicador: string): string {
   const nombres: { [key: string]: string } ={
      dolar: 'Dólar Observado',
      euro: 'Euro',
      uf: 'Unidad de Fomento',
      utm: 'Unidad Tributaria Mensual',
      ipc: 'Índice de Precios al Consumidor (IPC)',
      bitcoin: 'Bitcoin'
    };

    return nombres[indicador.toLowerCase()] || indicador.toUpperCase();
  }

  mostrarDetalle(indicador: any): void {
  
    if (!indicador || !indicador.nombre) {
      console.error("📌 Error: indicador es null o no tiene nombre.");
      return;
    }
  
    this.indicadorSeleccionado = {
      nombre: indicador.nombre.toUpperCase(),
      valor: indicador.valor || "No disponible",
      fecha: indicador.fecha || "No disponible"
    };
  
    let consulta$ = indicador.nombre.toLowerCase() === "ipc" || indicador.nombre.toLowerCase() === "utm"
      ? this.indicadoresService.getUltimos12Meses()
      : this.indicadoresService.getUltimos10Dias();
  
    consulta$.subscribe(
      data => {
  
        if (!data || data.length === 0) {
          console.warn("No se recibieron datos históricos.");
          return;
        }
  
        this.datosHistoricos = data.map(d => ({
          indicador: d.indicador.toUpperCase(),
          fecha: d.fecha,
          valor: d.valor
        }));
  
        this.modalAbierto = true;
      },
      error => {
        console.error("Error al obtener datos históricos:", error);
      }
    );
  }
  
  cerrarModal(): void {
    this.modalAbierto = false;
  }
}
