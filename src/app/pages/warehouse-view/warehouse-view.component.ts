import { Component } from '@angular/core';
import { WarehouseCardComponent } from '../warehouse-card/warehouse-card.component';
import { WarehouseUserListComponent } from '../warehouse-user-list/warehouse-user-list.component';



@Component({
  selector: 'app-warehouse-view',
  standalone: true,
  imports: [WarehouseCardComponent,WarehouseUserListComponent],
  templateUrl: './warehouse-view.component.html',
  styleUrl: './warehouse-view.component.css'
})
export class WarehouseViewComponent {

}
