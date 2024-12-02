import { Component, inject, Input } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { Iuser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { RouterLink } from '@angular/router';
import { Iwarehouse2 } from '../../interfaces/iwarehouse2.interface';
import { Iuser2 } from '../../interfaces/iuser2.interface';

@Component({
  selector: 'app-warehouse-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './warehouse-card.component.html',
  styleUrl: './warehouse-card.component.css'
})

export class WarehouseCardComponent {
  @Input() warehouse_id!: number;
  warehouseServices = inject(WarehousesService);
  warehouse: Iwarehouse2 | undefined;
  // warehouse: Iwarehouse | undefined;
  operators: Iuser2[] | undefined;
  managers: Iuser2[] | undefined;
  // operators: Iuser[] | undefined;
  // managers: Iuser[] | undefined;
  n_operators: number = 0;
  n_managers: number = 0;
  n_employees: number = 0;

  userServices = inject(UsersService);

  async ngOnInit() {

    const res = await this.warehouseServices.getById(this.warehouse_id)
    console.log('hola', res)
    this.warehouse = res

    // const res2 = await this.userServices.getByWarehouseId(this.warehouse_id)

    this.managers = res.users!.filter(employee => employee.role === 'manager')
    this.operators = res.users!.filter(employee => employee.role === 'operator')
    this.n_operators = this.operators!.length
    this.n_managers = this.managers!.length
    this.n_employees = this.n_managers + this.n_operators
  }
}