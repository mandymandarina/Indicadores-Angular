import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IndicadoresService } from '../../services/indicadores.service';

@Component({
  selector: 'app-historial-indicador',
  templateUrl: './historial-indicador.component.html',
  styleUrls: ['./historial-indicador.component.css']
})
export class HistorialIndicadorComponent implements OnInit {
  indicador!: string;
  datosHistoricos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private indicadoresService: IndicadoresService
  ) {}

  ngOnInit(): void {
    this.indicador = this.route.snapshot.paramMap.get('indicador') || '';
    this.indicador = this.normalizarNombre(this.indicador);
  
    let consulta$ = this.indicador === "ipc" || this.indicador === "utm"
      ? this.indicadoresService.getUltimos12Meses()
      : this.indicadoresService.getUltimos10Dias();
  
    consulta$.subscribe(data => {
  
      if (!data || data.length === 0) {
        console.warn("No se encontraron datos históricos.");
        return;
      }
  
      this.datosHistoricos = data.filter(d => 
        this.normalizarNombre(d.indicador) === this.indicador
      );
    });
  }
  
  normalizarNombre(nombre: string): string {
    return nombre.toLowerCase().replace(/s$/, '').replace(/e$/, '');
  }

  volver(): void {
    window.history.back();
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
