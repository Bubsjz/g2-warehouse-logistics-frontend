import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, Warehouse, Truck, Product, DeliveryProduct, CombinedResponse } from '../interfaces/order.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}


  // Obtener envío por ID
  getDeliveryById(id: number, role: string): Observable<CombinedResponse> {
    const url = role === 'operator'
      ? `${this.baseUrl}/operator/modify-order/${id}`
      : `${this.baseUrl}/manager/review-order/${id}`;
    console.log('Fetching delivery data from URL:', url);
    return this.http.get<CombinedResponse>(url);
  }

  // Relación entre envíos y productos
  getDeliveryProducts(id: number, role: string): Observable<DeliveryProduct[]> {
    const url = role === 'operator'
      ? `${this.baseUrl}/operator/modify-order/${id}`
      : `${this.baseUrl}/manager/review-order/${id}`;

    return this.http.get<DeliveryProduct[]>(url);
  }

  // Crear envío
  createDelivery(delivery: Delivery): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.baseUrl}/create-order`, delivery);
  }

  updateDelivery(id: number, delivery: Delivery): Observable<any> {
    const url = `${this.baseUrl}/operator/modify-order/${id}`;
    console.log('PUT URL:', url);
    return this.http.put(url, delivery);
  }

  // Eliminar envío
  deleteDelivery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/modify-order/${id}`);
  }

  // Cambiar estado de un envío
  updateDeliveryStatus(id: number, comments: string): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.baseUrl}/manager/review-order/${id}`, { comments });
  }

  // Actualizar comentarios de un envío
  updateDeliveryComments(id: number, comments: string): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.baseUrl}/manager/review-order/${id}`, { comments });
  }

// OBTENER DATOS FUNCIONAMIENTO FORMULARIO
    getCombinedData(): Observable<{ warehouse: Warehouse[]; truck: Truck[]; productNames: Product[] }> {
      const url = `${this.baseUrl}/operator/creation-data`;
      return this.http.get<{ warehouse: Warehouse[]; truck: Truck[]; productNames: Product[] }>(url);
    }


}



