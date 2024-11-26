import { Injectable } from '@angular/core';
import { Iwarehouse } from '../interfaces/iwarehouse.interface';
import { WAREHOUSES } from '../db/warehouses.db';
import { Iuser } from '../interfaces/iuser.interface';
import { USERS } from '../db/users.db';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {

  private arrWarehouses: Iwarehouse[] = WAREHOUSES;
  private arrUsers: Iuser[] = USERS;

  getAll(): Iwarehouse[] {
    return this.arrWarehouses;
  }

  getById(id: number): Iwarehouse | undefined {
    let warehouse = this.arrWarehouses.find(warehouse => warehouse.id === id)
    return warehouse
  }
}
