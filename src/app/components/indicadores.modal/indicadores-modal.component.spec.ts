import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndicadoresModalComponent } from './indicadores-modal.component';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('IndicadoresModalComponent', () => {
  let component: IndicadoresModalComponent;
  let fixture: ComponentFixture<IndicadoresModalComponent>;
  let mockIndicadoresService: jasmine.SpyObj<IndicadoresService>;

  beforeEach(async () => {
    mockIndicadoresService = jasmine.createSpyObj('IndicadoresService', ['getDatosHistoricos']);

    await TestBed.configureTestingModule({
      declarations: [ IndicadoresModalComponent ],
      providers: [
        { provide: IndicadoresService, useValue: mockIndicadoresService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cerrar event when cerrarModal is called', () => {
    spyOn(component.cerrar, 'emit');
    component.cerrarModal();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('should log warning if datosHistoricos is empty on ngOnInit', () => {
    spyOn(console, 'warn');
    component.datosHistoricos = [];
    component.ngOnInit();
    expect(console.warn).toHaveBeenCalledWith("Error: `datosHistoricos` está vacío en el modal.");
  });

});
