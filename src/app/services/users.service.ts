import { inject, Injectable } from '@angular/core';
import { Iuser } from '../interfaces/iuser.interface';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private baseUrl: string = "http://localhost:3000/users";
  private httpClient = inject(HttpClient);

  getAll(): Promise<Iuser[]> {
    return lastValueFrom(this.httpClient.get<Iuser[]>(this.baseUrl))
  }

  getById(id: number): Promise<Iuser[]> {
    return lastValueFrom(this.httpClient.get<Iuser[]>(`${this.baseUrl}?id=${id}`))
  }

  getByWarehouseId(warehouse_id: number): Promise<Iuser[]> {
    return lastValueFrom(this.httpClient.get<Iuser[]>(`${this.baseUrl}?warehouse_id=${warehouse_id}`))
  }

}
