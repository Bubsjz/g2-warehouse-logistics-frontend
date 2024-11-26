import { Component, inject, Input } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { Iuser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-warehouse-card',
  standalone: true,
  imports: [],
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

  ngOnInit() {

    this.warehouse = this.warehouseServices.getById(this.warehouse_id)
    this.managers = this.warehouse?.employees.filter(employee => employee.rol === 'manager')
    this.operators = this.warehouse?.employees.filter(employee => employee.rol === 'operator')
    this.n_operators = this.operators!.length
    this.n_managers = this.managers!.length
  }
}
