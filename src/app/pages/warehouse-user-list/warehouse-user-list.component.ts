import { Component, inject, Input } from '@angular/core';
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
  @Input() warehouse_id!: number;
  warehouseServices = inject(WarehousesService);
  warehouse: Iwarehouse | undefined;
  employees: Iuser[] | undefined;

  async ngOnInit() {

    const res = await this.warehouseServices.getById(this.warehouse_id)
    this.warehouse = res[0]
    this.employees = this.warehouse?.employees
  }

}
