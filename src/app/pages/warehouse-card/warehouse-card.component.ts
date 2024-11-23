import { Component, inject } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';

@Component({
  selector: 'app-warehouse-card',
  standalone: true,
  imports: [],
  templateUrl: './warehouse-card.component.html',
  styleUrl: './warehouse-card.component.css'
})
export class WarehouseCardComponent {
  warehouseServices = inject(WarehousesService);
  warehouseList: Iwarehouse[] = [];

}
