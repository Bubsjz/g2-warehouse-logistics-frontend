import { Component, inject } from "@angular/core";
import { OrderFilterComponent } from "../../components/order-filter/order-filter.component";
import { Deliveri } from "../../interfaces/deliveri.interface";
import { DeliveriService } from "../../services/deliveri.service";
import { UserService } from "../../services/user.service";
import { User } from "../../interfaces/user.interface";
import { NewOrderBtnComponent } from "../../components/new-order-btn/new-order-btn.component";
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [OrderFilterComponent, NewOrderBtnComponent,RouterLink],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {
  
  userService = inject(UserService);
  deliveriService = inject(DeliveriService);

  loginUser!: User[];
  arrDeliveri: Deliveri[]= []


  async ngOnInit() {
    this.loginUser = await this.userService.getById(10);
    console.log(this.loginUser[0].name)
    this.arrDeliveri = await this.deliveriService.getAll();
   
    
  }

  
  filterPadre(event: Deliveri[]) {
    this.arrDeliveri = event;
    
  }

}
