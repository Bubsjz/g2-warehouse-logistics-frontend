import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, Warehouse, Truck, Product, DeliveryProduct } from '../interfaces/interfaces'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = 'http://localhost:3000'; // Cambiar al endpoint de tu back-end en producción

  constructor(private http: HttpClient) {}


  getDeliveryById(id: number): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.baseUrl}/delivery/${id}`);
  }

  createDelivery(delivery: any): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.baseUrl}/delivery`, delivery);
  }

  updateDelivery(id: number, delivery: any): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.baseUrl}/delivery/${id}`, delivery);
  }

  deleteDelivery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delivery/${id}`);
  }

  // Cambiar estado de una entrega
  updateDeliveryStatus(id: number, status: string): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.baseUrl}/delivery/${id}`, { status });
  }

  // Actualizar comentarios de una entrega
  updateDeliveryComments(id: number, comments: string): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.baseUrl}/delivery/${id}`, { comments });
  }

  // Almacenes
  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouse`);
  }

  // Camiones
  getTrucks(): Observable<Truck[]> {
    return this.http.get<Truck[]>(`${this.baseUrl}/truck`);
  }

  // Productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/product`);
  }

  // Relación entre entregas y productos
  getDeliveryProducts(): Observable<DeliveryProduct[]> {
    return this.http.get<DeliveryProduct[]>(`${this.baseUrl}/delivery_products`);
  }

  createDeliveryProduct(deliveryProduct: DeliveryProduct): Observable<DeliveryProduct> {
    return this.http.post<DeliveryProduct>(`${this.baseUrl}/delivery_products`, deliveryProduct);
  }
  
}



