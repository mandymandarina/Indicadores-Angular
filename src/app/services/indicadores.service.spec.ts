import { TestBed } from '@angular/core/testing';
import { IndicadoresService } from './indicadores.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('IndicadoresService', () => {
  let service: IndicadoresService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IndicadoresService]
    });

    service = TestBed.inject(IndicadoresService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch indicador data', () => {
    const dummyResponse = { codigo: 'dolar', nombre: 'Dólar', unidad_medida: 'Pesos', serie: [] };
    service.getIndicador('dolar').subscribe(data => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(req => req.url.includes('dolar'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch UTM data', () => {
    const dummyResponse = { unidad_medida: 'Pesos', serie: [] };
    service.getUTM().subscribe(data => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(req => req.url.includes('utm'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should handle error in getUltimos10Dias', () => {
    service.getUltimos10Dias().subscribe(data => {
      expect(data).toEqual([]);
    });

    const requests = httpMock.match(() => true);
    requests.forEach(req => req.flush(null, { status: 500, statusText: 'Server Error' }));
  });
});
