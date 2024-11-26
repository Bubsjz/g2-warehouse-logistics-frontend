import { inject, Injectable } from '@angular/core';
import { Warehouse } from '../interfaces/warehouser.interface';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl:string = 'http://localhost:3002/warehouses'
  private httpClient = inject(HttpClient)

  getAll(){
    return lastValueFrom(this.httpClient.get<Warehouse[]>(this.apiUrl))
  }

  getbyId(id_warehouse:number){
    return lastValueFrom(this.httpClient.get<Warehouse[]>(`${this.apiUrl}?id_warehouse=${id_warehouse}`))
  }

  
}
