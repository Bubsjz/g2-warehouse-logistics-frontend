import { Component } from '@angular/core';
import { WarehouseCardComponent } from '../warehouse-card/warehouse-card.component';
import { WarehouseUserListComponent } from '../warehouse-user-list/warehouse-user-list.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';



@Component({
  selector: 'app-warehouse-view',
  standalone: true,
  imports: [WarehouseCardComponent,WarehouseUserListComponent,PaginatorComponent],
  templateUrl: './warehouse-view.component.html',
  styleUrl: './warehouse-view.component.css'
})
export class WarehouseViewComponent {

}
