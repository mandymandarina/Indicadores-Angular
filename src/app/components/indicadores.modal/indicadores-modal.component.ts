import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { IndicadoresService } from 'src/app/services/indicadores.service';

@Component({
  selector: 'app-indicadores-modal',
  templateUrl: './indicadores-modal.component.html',
  styleUrls: ['./indicadores-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IndicadoresModalComponent implements OnChanges  {
  @Input() modalAbierto: boolean = false;
  @Output() cerrar = new EventEmitter<void>();

  constructor(private indicadoresService: IndicadoresService) {}
  @Input() indicador!: { codigo: string; nombre: string; fecha: string; valor: string};
  @Input() datosHistoricos: { indicador: string; fecha: string; valor: number }[] = [];

  ngOnChanges(): void {
  
  }

  datosFiltrados: { indicador: string; fecha: string; valor: number }[] = [];

  ngOnInit(): void {

  if (!this.datosHistoricos || this.datosHistoricos.length === 0) {
    console.warn("Error: `datosHistoricos` está vacío en el modal.");
  }
  }
  
  cerrarModal(): void {
    this.cerrar.emit();
  }

  
}

