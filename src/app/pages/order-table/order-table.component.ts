import { Component, inject } from "@angular/core";
import { OrderFilterComponent } from "../../components/order-filter/order-filter.component";
import { Delivery } from "../../interfaces/deliveri.interface";
import { UserService } from "../../services/user.service";
import { User } from "../../interfaces/user.interface";
import { NewOrderBtnComponent } from "../../components/new-order-btn/new-order-btn.component";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Warehouse } from "../../interfaces/warehouser.interface";
import { WarehouseService } from "../../services/warehouse.service";



@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [OrderFilterComponent, NewOrderBtnComponent, RouterLink, DatePipe],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {

  userService = inject(UserService);
  warehouseService = inject(WarehouseService);

  loginUser!: any
  w!: Warehouse
  numberWarehouse!: number
  DeliveriesWarehouse: Delivery[] = [];
  

  async ngOnInit() {

    try {
     const [response] = await this.userService.getById(9); // este es el usuario logado 
      this.loginUser = response
      this.numberWarehouse = this.loginUser.asigned_id_warehouse // este es el id del warehouse
     const [res] = await this.warehouseService.getbyId(this.numberWarehouse) // este es el almacen con todos los pedidos
      this.w = res
      this.DeliveriesWarehouse = this.w.deliveries
    } catch (error) {
      console.log(error)
    }
  }

  filterFather(event: Delivery[]) {
  this.DeliveriesWarehouse = event
  }
  

  entryOrders() {
    const pedidosEntrada = this.w.deliveries.filter(deliveries => deliveries.origin_warehouse.name !== this.w.name)
    this.DeliveriesWarehouse = pedidosEntrada

  }

  outputOrders() {
    const pedidosSalida = this.w.deliveries.filter(deliveries => deliveries.origin_warehouse.name === this.w.name)
    this.DeliveriesWarehouse = pedidosSalida
  }


}
