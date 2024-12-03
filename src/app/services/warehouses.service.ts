import { inject, Injectable } from '@angular/core';
import { Iwarehouse } from '../interfaces/iwarehouse.interface';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WarehousesService {

  private baseUrl: string = "http://localhost:3000/warehouses";
  private httpClient = inject(HttpClient)

  getAll(): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(this.baseUrl))
   }
  
  getById(id: number): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(`${this.baseUrl}?id=${id}`))
  }

}


  // Function to save or update a warehouse
  saveWarehouse(warehouse: any): Observable<any> {
    if (warehouse.id) {
      // Update existing warehouse
      return this.http.put(`${this.baseUrl}/warehouses/${warehouse.id}`, warehouse);
    } else {
      // Create new warehouse
      return this.http.post(`${this.baseUrl}/warehouses`, warehouse);
    }
  }
