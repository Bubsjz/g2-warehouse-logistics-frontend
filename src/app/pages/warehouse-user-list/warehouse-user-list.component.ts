import { Component, inject } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { Iuser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-warehouse-user-list',
  standalone: true,
  imports: [],
  templateUrl: './warehouse-user-list.component.html',
  styleUrl: './warehouse-user-list.component.css'
})
export class WarehouseUserListComponent {
  warehouseServices = inject(WarehousesService);
  warehouse: Iwarehouse | undefined;
  employees: Iuser[] | undefined;

  ngOnInit() {

    let warehouse_id = 1;
    this.warehouse = this.warehouseServices.getById(warehouse_id)
    this.employees = this.warehouse?.employees
  }

}
