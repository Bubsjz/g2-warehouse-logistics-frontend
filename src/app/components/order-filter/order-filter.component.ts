import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Delivery } from '../../interfaces/delivery.interface';
import { jwtDecode } from 'jwt-decode';

type decodeToken = {
  user_id: number;
  user_role: string;
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-order-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './order-filter.component.html',
  styleUrl: './order-filter.component.css'
})
export class OrderFilterComponent {

  

  @Input() productos:Delivery[]= [];

  orders!:Delivery[]
  filteredDeliveries!:Delivery[];
  selectedStatus: string = '';
  userRol!:String;

  
  @Output() filteredDeliveriesChange:EventEmitter<Delivery[]> = new EventEmitter;

  async ngOnInit(){
    console.log(this.productos)
     this.orders = this.productos;
     this.filteredDeliveries = this.orders

  }


filterByStatus(): void {
  if (this.selectedStatus) {
    this.filteredDeliveries = this.orders.filter(delivery => 
      delivery.status.toLowerCase() === this.selectedStatus.toLowerCase()
    );
    
  } else {
    this.filteredDeliveries = this.orders;  // Si no hay filtro, mostramos todas las entregas
  }
  this.filteredDeliveriesChange.emit(this.filteredDeliveries);
  
}


}
