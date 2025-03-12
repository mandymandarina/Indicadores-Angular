import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, forkJoin, of, map  } from 'rxjs';

interface Indicador {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  serie: { fecha: string; valor: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  private apiUrlCMF = 'https://api.cmfchile.cl/api-sbifv3/recursos_api';
  private apiKey = 'ed9020e638c57fb013fd29216507c1ea1d17312d'; // clave de API key
  private apiUrlMindicador = 'https://mindicador.cl/api';

  constructor(private http: HttpClient) {}

  // Obtener indicadores de CMF
  getIndicador(indicador: string): Observable<any> {
    const headers = new HttpHeaders({ 'Accept': 'application/json' });
    const url = `${this.apiUrlCMF}/${indicador}?apikey=${this.apiKey}&formato=json`;
    return this.http.get<any>(url, { headers });
  }

  // Obtener UTM de CMF
  getUTM(): Observable<any> {
    const añoActual = new Date().getFullYear();
    return this.http.get<any>(`${this.apiUrlCMF}/utm/${añoActual}?apikey=${this.apiKey}&formato=json`);
  }
// Obtener historial de Mindicador
  obtenerHistorial(): Observable<any[]> {
    const indicadores = ['dolar', 'euro', 'uf'];
    const requests: Observable<any>[] = [];
    const fechaActual = new Date();

    for (let i = 0; i < 10; i++) {
      const fechaConsulta = new Date(fechaActual);
      fechaConsulta.setDate(fechaConsulta.getDate() - i);
      const fechaStr = fechaConsulta.toISOString().split('T')[0];

      indicadores.forEach(indicador => {
        const url = `${this.apiUrlMindicador}/${indicador}/${fechaStr}`;
        requests.push(this.http.get<any>(url));
      });
    }

    return forkJoin(requests);
  }

  //obtener 10 últimos dias 
  getUltimos10Dias(): Observable<any[]> {
    return forkJoin({
      dolar: this.http.get<any>(`${this.apiUrlMindicador}/dolar`).pipe(
        catchError(error => {
          console.warn("Error al obtener dólar:", error);
          return of(null);
        })
      ),
      euro: this.http.get<any>(`${this.apiUrlMindicador}/euro`).pipe(
        catchError(error => {
          console.warn("Error al obtener euro:", error);
          return of(null);
        })
      ),
      uf: this.http.get<any>(`${this.apiUrlMindicador}/uf`).pipe(
        catchError(error => {
          console.warn("Error al obtener UF:", error);
          return of(null);
        })
      ),
      utm: this.http.get<any>(`${this.apiUrlMindicador}/utm`).pipe(
        catchError(error => {
          console.warn("Error al obtener UTM:", error);
          return of(null);
        })
      ),
      ipc: this.http.get<any>(`${this.apiUrlMindicador}/ipc`).pipe(
        catchError(error => {
          console.warn("Error al obtener IPC:", error);
          return of(null);
        })
      )
    }).pipe(
      map(data => {

        return Object.entries(data).reduce((acc: any[], [key, value]) => {
          if (value && value.serie) {
            acc.push(...value.serie.slice(0, 10).map((item: any) => ({
              indicador: key.toUpperCase(), 
              fecha: item.fecha,
              valor: item.valor
            })));
          }
          return acc;
        }, []);
      })
    );
  }

  // Obtener los datos para el gráfico
  obtenerDatosGrafico(): Observable<{ dolar: Indicador; euro: Indicador; uf: Indicador }> {
    const indicadores = ['dolar', 'euro', 'uf'];
    const requests: { [key: string]: Observable<any> } = {};
    const fechaActual = new Date();
    const fechaInicio = new Date(fechaActual);
    fechaInicio.setDate(fechaInicio.getDate() - 9); // Muestra 10 días atras

    indicadores.forEach(indicador => {
      const url = `${this.apiUrlMindicador}/${indicador}`;
      requests[indicador] = this.http.get<any>(url);
    });

    return forkJoin({
      dolar: this.http.get<Indicador>(`${this.apiUrlMindicador}/dolar`),
      euro: this.http.get<Indicador>(`${this.apiUrlMindicador}/euro`),
      uf: this.http.get<Indicador>(`${this.apiUrlMindicador}/uf`),
    });
  }

  // Obtener 12 ultimos meses para Utm e Ipc
  getUltimos12Meses(): Observable<any[]> {
    return forkJoin({
      ipc: this.http.get<any>(`${this.apiUrlMindicador}/ipc`).pipe(
        catchError(error => {
          console.warn("Error al obtener IPC:", error);
          return of(null);
        })
      ),
      utm: this.http.get<any>(`${this.apiUrlMindicador}/utm`).pipe(
        catchError(error => {
          console.warn("Error al obtener UTM:", error);
          return of(null);
        })
      )
    }).pipe(
      map(data => {
  
        return Object.entries(data).reduce((acc: any[], [key, value]) => {
          if (value && value.serie) {
            acc.push(...value.serie.slice(0, 12).map((item: any) => ({
              indicador: key.toUpperCase(), 
              fecha: item.fecha,
              valor: item.valor
            })));
          }
          return acc;
        }, []);
      })
    );
  }
  
}

