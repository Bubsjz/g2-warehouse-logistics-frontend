
import { inject, Injectable } from '@angular/core';
import { Iwarehouse } from '../interfaces/iwarehouse.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Iwarehouse2 } from '../interfaces/iwarehouse2.interface';
import { Warehouse } from '../interfaces/order.interface';

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
  private httpClient = inject(HttpClient);

  getAll(): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(`${this.baseUrl}/warehouse`))
   }

  getById(id: number): Promise<Iwarehouse2> {
    return lastValueFrom(this.httpClient.get<Iwarehouse2>(`${this.baseUrl}/warehouse/${id}`))
  }

  createWarehouse(body:FormData){
    return lastValueFrom(this.httpClient.post<warehouse>(`${this.baseUrl}/warehouse`, body))
  }

  update(warehouse_id:number,body:FormData){
    return firstValueFrom(this.httpClient.put<Warehouse>(`${this.baseUrl}/warehouse/${warehouse_id}`,body))
  }

  delete(warehouse_id:number){
    return lastValueFrom(this.httpClient.delete<Warehouse>(`${this.baseUrl}/warehouse/${warehouse_id}`))
  }

}
