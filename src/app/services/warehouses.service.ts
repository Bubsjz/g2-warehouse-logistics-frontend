import { inject, Injectable } from '@angular/core';
import { Iwarehouse } from '../interfaces/iwarehouse.interface';
import { WAREHOUSES } from '../db/warehouses.db';
import { Iuser } from '../interfaces/iuser.interface';
import { USERS } from '../db/users.db';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {

  private arrWarehouses: Iwarehouse[] = WAREHOUSES;
  private arrUsers: Iuser[] = USERS;

  private baseUrl: string = "http://localhost:3000/warehouses";
  private httpClient = inject(HttpClient)

  getAll(): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(this.baseUrl))
   }
  
  getById(id: number): Promise<Iwarehouse[]> {
    return lastValueFrom(this.httpClient.get<Iwarehouse[]>(`${this.baseUrl}?id=${id}`))
  }
}
