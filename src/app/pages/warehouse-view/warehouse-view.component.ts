import { Component, inject } from '@angular/core';
import { WarehouseCardComponent } from '../warehouse-card/warehouse-card.component';
import { WarehouseUserListComponent } from '../warehouse-user-list/warehouse-user-list.component';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-warehouse-view',
  standalone: true,
  // imports: [WarehouseCardComponent,WarehouseUserListComponent,PaginatorComponent],
  imports: [WarehouseCardComponent,WarehouseUserListComponent],
  templateUrl: './warehouse-view.component.html',
  styleUrl: './warehouse-view.component.css'
})
export class WarehouseViewComponent {
  activatedRoute = inject(ActivatedRoute)
  warehouse_id!: number;
  
  ngOnInit() {

    this.activatedRoute.params.subscribe(async (params: any) => {
      this.warehouse_id = Number(params.id);
    })
  }

}
