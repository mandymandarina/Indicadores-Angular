import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-grafico-indicador',
  templateUrl: './grafico-indicador.component.html',
  styleUrls: ['./grafico-indicador.component.css']
})
export class GraficoIndicadorComponent implements OnChanges {
  @Input() indicador!: { nombre: string };
  @Input() datosHistoricos: { indicador: string; fecha: string; valor: number }[] = [];

  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;
  chart: any;
  datosFiltrados: { fecha: string; valor: number }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.indicador || !this.indicador.nombre) {
      console.warn("Error: No se recibió un indicador válido.");
      return;
    }
  
    if (!this.datosHistoricos || this.datosHistoricos.length === 0) {
      console.warn("No se han recibido datos históricos.");
      return;
    }
  
    // Cambiar nombres de indicadores antes de filtrar
    const nombreIndicador = this.normalizarNombre(this.indicador.nombre);
  
    this.datosFiltrados = this.datosHistoricos.filter(d => 
      this.normalizarNombre(d.indicador) === nombreIndicador
    );
  
    if (this.datosFiltrados.length === 0) {
      console.warn("No hay datos suficientes para graficar.");
      return;
    }
  
    this.generarGrafico();
  }
  
  
  normalizarNombre(nombre: string): string {
    return nombre.toLowerCase().replace(/s$/, '').replace(/e$/, '');
  }
  
  generarGrafico(): void {
    setTimeout(() => {
      if (!this.chartCanvas) {
        console.error("Error: No se encontró el canvas del gráfico.");
        return;
      }
  
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) {
        console.error("Error: No se pudo obtener el contexto del canvas.");
        return;
      }
  
      if (this.chart) {
        this.chart.destroy();
      }
  
      const fechas = this.datosFiltrados.map(d => this.formatearFecha(d.fecha));
      const horas = this.datosFiltrados.map(d => this.formatearHora(d.fecha));
      const valores = this.datosFiltrados.map(d => d.valor);
  
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: fechas, //Mostramos solo la fecha en el eje X
          datasets: [
            {
              label: this.indicador.nombre,
              data: valores,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              borderWidth: 2,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const index = tooltipItem.dataIndex;
                  return `Hora: ${horas[index]} - Valor: ${tooltipItem.raw}`;
                }
              }
            }
          }
        }
      });
    }, 500);
  }
  

  formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CL');
  }
  
  formatearHora(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-CL');
  }
  
}
