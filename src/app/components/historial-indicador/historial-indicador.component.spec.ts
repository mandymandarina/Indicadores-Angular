import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialIndicadorComponent } from './historial-indicador.component';
import { ActivatedRoute } from '@angular/router';
import { IndicadoresService } from '../../services/indicadores.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HistorialIndicadorComponent', () => {
  let component: HistorialIndicadorComponent;
  let fixture: ComponentFixture<HistorialIndicadorComponent>;
  let mockIndicadoresService: jasmine.SpyObj<IndicadoresService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockIndicadoresService = jasmine.createSpyObj('IndicadoresService', ['getUltimos10Dias', 'getUltimos12Meses']);
    mockIndicadoresService.getUltimos12Meses.and.returnValue(of([]));
    mockIndicadoresService.getUltimos10Dias.and.returnValue(of([]));
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('dolar')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [HistorialIndicadorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: IndicadoresService, useValue: mockIndicadoresService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialIndicadorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUltimos10Dias for non-ipc/utm indicators', () => {
    mockIndicadoresService.getUltimos10Dias.and.returnValue(of([]));
    component.ngOnInit();
    expect(mockIndicadoresService.getUltimos10Dias).toHaveBeenCalled();
  });

  it('should call getUltimos12Meses for ipc/utm indicators', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('ipc');
    component.ngOnInit();
    expect(mockIndicadoresService.getUltimos12Meses).toHaveBeenCalled();
  });

  it('should filter received data correctly', () => {
    const mockData = [
      { indicador: 'dolar', fecha: '2025-03-10', valor: 900 },
      { indicador: 'euro', fecha: '2025-03-10', valor: 1000 }
    ];
    mockIndicadoresService.getUltimos10Dias.and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.datosHistoricos.length).toBe(1);
    expect(component.datosHistoricos[0].indicador).toBe('dolar');
  });

  it('should format time correctly', () => {
    const formattedTime = component.formatearHora('2025-03-10T12:00:00Z');
    expect(formattedTime).toBe(new Date('2025-03-10T12:00:00Z').toLocaleTimeString('es-CL'));
  });
});
