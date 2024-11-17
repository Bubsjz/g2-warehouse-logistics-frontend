import { Component, inject } from "@angular/core";
import { NewOrderBtnComponent } from "../../components/new-order-btn/new-order-btn.component";
import { OrderFilterComponent } from "../../components/order-filter/order-filter.component";
import { PaginatorComponent } from "../../components/paginator/paginator.component";
import { Deliveri } from "../../interfaces/deliveri.interface";
import { DeliveriService } from "../../services/deliveri.service";



@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [PaginatorComponent, NewOrderBtnComponent, OrderFilterComponent],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {

  deliveriService = inject(DeliveriService);
  arrDeliveri: Deliveri[]= []


  async ngOnInit() {
    
    this.arrDeliveri = await this.deliveriService.getAll();
  }


  filterPadre(event: Deliveri[]) {
    this.arrDeliveri = event;
  }

}
