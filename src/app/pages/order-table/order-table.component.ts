import { Component, inject } from "@angular/core";
import { OrderFilterComponent } from "../../components/order-filter/order-filter.component";
import { Delivery } from "../../interfaces/delivery.interface";
import { NewOrderBtnComponent } from "../../components/new-order-btn/new-order-btn.component";
import { Router, RouterLink } from "@angular/router";
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
  router = inject(Router)

  arrDeliveries:Delivery[]=[];
  userLogin!:string
  idUser!:decodeToken


  async ngOnInit() {
    
    // manager 
    const token = localStorage.getItem('authToken')
    if(token){
      const decoded = jwtDecode(token) as decodeToken
      this.idUser = decoded
     

      if(this.idUser.user_role === "manager"){
        
        //const response2 = await this.managerService.getManagerById(this.idUser.user_id)
        this.userLogin = this.idUser.user_role

        const response1 = await this.managerService.getEntryOrders()
        this.arrDeliveries = response1
       
        


      }else{
        //operator   
        //const response2 = await this.operatorService.getUserById(this.idUser.user_id)
        this.userLogin = this.idUser.user_role
        const response1 =  await this.operatorService.getAllDeliveryByUser()
        this.arrDeliveries = response1
       
      
      }

      
      
    }else{
      alert('Token is missing')
      this.router.navigateByUrl('/login')
    }
  }
    


  filterFather(event:Delivery[]) {
    if(event.length <= 0 ){
      alert('no products')
    }else{
      this.arrDeliveries = event
    }
  }
  

  entryOrders() {
   

  }

  outputOrders() {
   

}

}
