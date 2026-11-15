import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Recibo {
  idRecibo?: number;
  kwConsumidos: number;
  precioKw: number;
  precioEnergiaConsumida: number;
  precioAseo: number;
  precioTotal: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface Apartamento {
  idApartamento: number;
  descripcion: string;
  Responsable_idResponsable: number;
  idResponsable?: number;
  nombres?: string;
  responsable_nombre?: string;
  idRol?: number;
  Estado_idEstado?: number;
  lecturaAnterior?: number;
}

export interface Responsable {
  idResponsable?: number;
  nombres: string;
  idRol?: number;
  Estado_idEstado?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface Consumo {
  idConsumo: number;
  Recibo_idRecibo: number;
  Apartamento_idApartamento: number;
  kw: number;
  precioConsumo: number;
  precioAseo: number;
  precioConsumoFinal: number;
  idResponsable: number;
  apartamento_descripcion?: string;
  idRol?: number;
  responsable_nombre?: string;
  lecturaAnterior?: number;
  kwConsumidos?: number;
  kwLectura?: number;
}

export interface ConsumosResponse {
  message: Consumo[];
  totales?: {
    totalConsumo: number;
    totalAseo: number;
    totalFinal: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Apartamentos
  getApartamentos(): Observable<{ message: Apartamento[] }> {
    return this.http.get<{ message: Apartamento[] }>(`${this.baseUrl}/apartamentos`);
  }

  getApartamentosCalcular(): Observable<{ message: Apartamento[] }> {
    return this.http.get<{ message: Apartamento[] }>(`${this.baseUrl}/apartamentos/calcular`);
  }

  crearApartamento(data: { idResponsable: number; descripcion: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/apartamentos/crear`, data);
  }

  editarApartamento(data: { id: number; idResponsable: number; descripcion: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/apartamentos/actualizar`, data);
  }

  // Responsables / Inquilinos
  getResponsables(): Observable<{ message: Responsable[] }> {
    return this.http.get<{ message: Responsable[] }>(`${this.baseUrl}/responsables`);
  }

  crearResponsable(data: { nombres: string; idRol?: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/responsables/crear`, data);
  }

  editarResponsable(data: { id: number; nombres: string; idEstado: number }): Observable<any> {
    return this.http.put(`${this.baseUrl}/responsables/actualizar`, data);
  }

  borrarResponsable(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/responsables/borrar`, { body: { id } });
  }

  // Recibos y Consumos
  getRecibos(): Observable<{ message: Recibo[] }> {
    return this.http.get<{ message: Recibo[] }>(`${this.baseUrl}/recibos`);
  }

  getReciboPorId(id: number): Observable<{ message: Recibo }> {
    return this.http.get<{ message: Recibo }>(`${this.baseUrl}/recibos/${id}`);
  }

  getConsumosDeRecibo(id: number): Observable<ConsumosResponse> {
    return this.http.get<ConsumosResponse>(`${this.baseUrl}/recibos/consumos/${id}`);
  }

  crearRecibo(data: {
    kwConsumidos: number;
    precioEnergiaConsumida: number;
    precioAseo: number;
    numeroContador: number[];
    lecturas?: Record<number, number | string>;
  }): Observable<{ message: string; reciboId: number }> {
    return this.http.post<{ message: string; reciboId: number }>(`${this.baseUrl}/recibos/crear`, data);
  }

  editarConsumo(id: number, data: {
    kwConsumidos: number;
    precioEnergiaConsumida: number;
    precioAseo: number;
    numeroContador: number[];
    lecturas?: Record<number, number | string>;
  }): Observable<{ message: string; reciboId: number }> {
    return this.http.put<{ message: string; reciboId: number }>(`${this.baseUrl}/recibos/editar-consumo/${id}`, data);
  }
}
