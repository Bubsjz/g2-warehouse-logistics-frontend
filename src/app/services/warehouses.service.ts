import { inject, Injectable } from '@angular/core';
import { Iwarehouse } from '../interfaces/iwarehouse.interface';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WarehousesService {

  private baseUrl: string = "http://localhost:3000/boss";
  private httpClient = inject(HttpClient)

  getAll(): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(`${this.baseUrl}/warehouse`))
   }

   getById(id: number): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(`${this.baseUrl}/warehouse/?id=${id}`))
  }

  // private baseUrl: string = "http://localhost:3000/warehouses";
  // private httpClient = inject(HttpClient)

  // getAll(): Promise<Iwarehouse[]> {
  //   return lastValueFrom(this.httpClient.get<Iwarehouse[]>(this.baseUrl))
  //  }
  
  // getById(id: number): Promise<Iwarehouse[]> {
  //   return lastValueFrom(this.httpClient.get<Iwarehouse[]>(`${this.baseUrl}?id=${id}`))
  // }

}
