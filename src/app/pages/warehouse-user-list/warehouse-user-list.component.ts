import { Component, inject, Input } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { Iuser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';
import { Iwarehouse2 } from '../../interfaces/iwarehouse2.interface';
import { Iuser2 } from '../../interfaces/iuser2.interface';

@Component({
  selector: 'app-warehouse-user-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './warehouse-user-list.component.html',
  styleUrl: './warehouse-user-list.component.css'
})

export class WarehouseUserListComponent {
  @Input() warehouse_id!: number;
  warehouseServices = inject(WarehousesService);
  warehouse: Iwarehouse2 | undefined;
  // warehouse: Iwarehouse | undefined;
  employees: Iuser2[] | undefined;
  // employees: Iuser[] | undefined;

  userServices = inject(UsersService)

  async ngOnInit() {

    const res = await this.warehouseServices.getById(this.warehouse_id)
    this.warehouse = res

    // const res2 = await this.userServices.getByWarehouseId(this.warehouse_id)
    this.employees = res.users;

  }

}
