import { Component, inject, Input } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { Iuser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { RouterLink } from '@angular/router';

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
  warehouse: Iwarehouse | undefined;
  operators: Iuser[] | undefined;
  managers: Iuser[] | undefined;
  n_operators: number = 0;
  n_managers: number = 0;
  n_employees: number = 0;

  userServices = inject(UsersService);

  async ngOnInit() {

    const res = await this.warehouseServices.getById(this.warehouse_id)
    console.log(res)
    this.warehouse = res[0]

    const res2 = await this.userServices.getByWarehouseId(this.warehouse_id)

    this.managers = res2.filter(employee => employee.role === 'manager')
    this.operators = res2.filter(employee => employee.role === 'operator')
    this.n_operators = this.operators!.length
    this.n_managers = this.managers!.length
    this.n_employees = this.n_managers + this.n_operators
  }
}