
import { inject, Injectable } from '@angular/core';
import { Iwarehouse } from '../interfaces/iwarehouse.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { Iwarehouse2 } from '../interfaces/iwarehouse2.interface';

type warehouse= {
name:string,
locality: string,
address: string,
image: File, 
}

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {

  private baseUrl: string = "http://localhost:3000/boss";
  private httpClient = inject(HttpClient)
  private baseUrl: string = "http://localhost:3000/warehouses";
  private Url: string = "http://localhost:3000/boss"
  private httpClient = inject(HttpClient);

  getAll(): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(`${this.baseUrl}/warehouse`))
   }
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(this.baseUrl));
  }

  getById(id: number): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(`${this.baseUrl}?id=${id}`));
  }

  getById(id: number): Promise<Iwarehouse2> {
    return lastValueFrom(this.httpClient.get<Iwarehouse2>(`${this.baseUrl}/warehouse/${id}`))
  }
  // Function to save or update a warehouse
  saveWarehouse(warehouse: any): Observable<any> {
    if (warehouse.id) {
      // Update existing warehouse
      return this.httpClient.put(`${this.baseUrl}/${warehouse.id}`, warehouse);
    } else {
      // Create new warehouse
      return this.httpClient.post(this.baseUrl, warehouse);
    }
  }

  createWarehouse(body:FormData){
    return lastValueFrom(this.httpClient.post<warehouse>(`${this.Url}/warehouse`, body))
  }

}
