import { Component, inject } from "@angular/core";
import { OrderFilterComponent } from "../../components/order-filter/order-filter.component";
import { Delivery } from "../../interfaces/delivery.interface";
import { NewOrderBtnComponent } from "../../components/new-order-btn/new-order-btn.component";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { OperatorService } from "../../services/operator.service";
import {jwtDecode} from 'jwt-decode';
import { ManagerService } from "../../services/manager.service";

type decodeToken = {
  user_id: number;
  user_role: string;
  iat: number;
  exp: number;
}




@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [OrderFilterComponent, NewOrderBtnComponent, RouterLink, DatePipe],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {

  operatorService = inject(OperatorService)
  managerService = inject(ManagerService)

  arrDeliveries:Delivery[]=[];
  userLogin!:string
  prueba!:decodeToken


  async ngOnInit() {
// manager 
    const token = localStorage.getItem('authToken')
    if(token){
      const decoded = jwtDecode(token) as decodeToken
      this.prueba = decoded
      const response3 = await this.managerService.getManagerById(this.prueba.user_id)
      this.userLogin = response3[0].role
      
    }

//operator   
     const response1 =  await this.operatorService.getAllDeliveryByUser()
     this.arrDeliveries = response1
     
     const response2 = await this.operatorService.getUserById(this.arrDeliveries[0].id_user)
     this.userLogin = response2[0].role



     
  }
    


  filterFather(event:Delivery[]) {
    if(event.length <= 0 ){
      alert('no hay productos con estas caracteristicas')
    }else{

      this.arrDeliveries = event
    }
  }
  

  entryOrders() {
   

  }

  outputOrders() {
   

}

}
