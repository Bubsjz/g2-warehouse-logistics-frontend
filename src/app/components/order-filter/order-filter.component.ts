import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NewOrderBtnComponent } from "../new-order-btn/new-order-btn.component";
import { FormsModule } from '@angular/forms';
import { Deliveri } from '../../interfaces/deliveri.interface';
import { DeliveriService } from '../../services/deliveri.service';

@Component({
  selector: 'app-order-filter',
  standalone: true,
  imports: [NewOrderBtnComponent ,FormsModule],
  templateUrl: './order-filter.component.html',
  styleUrl: './order-filter.component.css'
})
export class OrderFilterComponent {

  deliveriService = inject(DeliveriService)

  orders!:Deliveri[]
  filteredDeliveries: Deliveri[] = [];
  selectedStatus: string = '';

  
  @Output() filteredDeliveriesChange:EventEmitter<Deliveri[]> = new EventEmitter;

  async ngOnInit(){
    const allDeliveries = await this.deliveriService.getAll()
    this.orders = allDeliveries
    this.filteredDeliveries = this.orders
  }


filterByStatus(): void {
  if (this.selectedStatus) {
    this.filteredDeliveries = this.orders.filter(delivery => 
      delivery.Status.toLowerCase() === this.selectedStatus.toLowerCase()
    );
  } else {
    this.filteredDeliveries = this.orders;  // Si no hay filtro, mostramos todas las entregas
  }

  //console.log(this.selectedStatus)
  this.filteredDeliveriesChange.emit(this.filteredDeliveries);
  //console.log(this.filteredDeliveriesChange)
}


}
