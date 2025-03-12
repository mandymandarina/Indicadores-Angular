import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoIndicadorComponent } from './grafico-indicador.component';
import { ElementRef } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GraficoIndicadorComponent', () => {
  let component: GraficoIndicadorComponent;
  let fixture: ComponentFixture<GraficoIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficoIndicadorComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoIndicadorComponent);
    component = fixture.componentInstance;
    component.chartCanvas = new ElementRef(document.createElement('canvas'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should normalize indicator name correctly', () => {
    expect(component.normalizarNombre('Dólares')).toBe('dólar');
    expect(component.normalizarNombre('Euro')).toBe('euro');
  });

  it('should log error when indicator is missing', () => {
    spyOn(console, 'warn');
    component.indicador = undefined as any;
    component.ngOnChanges({});
    expect(console.warn).toHaveBeenCalledWith("Error: No se recibió un indicador válido.");
  });

  it('should log warning when no historical data is provided', () => {
    spyOn(console, 'warn');
    component.indicador = { nombre: 'Dólar' };
    component.datosHistoricos = [];
    component.ngOnChanges({});
    expect(console.warn).toHaveBeenCalledWith("No se han recibido datos históricos.");
  });

  it('should format time correctly', () => {
    const formattedTime = component.formatearHora('2025-03-10T12:00:00Z');
    expect(formattedTime).toBe(new Date('2025-03-10T12:00:00Z').toLocaleTimeString('es-CL'));
  });
});
