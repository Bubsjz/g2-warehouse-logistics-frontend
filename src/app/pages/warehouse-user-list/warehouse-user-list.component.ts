import { Component, inject, Input } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { Iuser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';
import { Iwarehouse2 } from '../../interfaces/iwarehouse2.interface';
import { Iuser2 } from '../../interfaces/iuser2.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';

type AlertResponse = { title: string; text: string; icon: SweetAlertIcon, cbutton: string};

@Component({
  selector: 'app-warehouse-user-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './warehouse-user-list.component.html',
  styleUrl: './warehouse-user-list.component.css'
})

export class WarehouseUserListComponent {
  @Input() warehouse_id!: number;
  warehouseServices = inject(WarehousesService);
  warehouse: Iwarehouse2 | undefined;
  // warehouse: Iwarehouse | undefined;
  employees: Iuser2[] | undefined;
  // employees: Iuser[] | undefined;

  userServices = inject(UsersService)

  async ngOnInit() {

    const res = await this.warehouseServices.getById(this.warehouse_id)
    this.warehouse = res

    // const res2 = await this.userServices.getByWarehouseId(this.warehouse_id)
    this.employees = res.users;
    console.log(this.employees)

  }

  async delete(id: number) {
    const currentUser = this.employees!.filter(employee => employee.id_user === id)
    let borrado = confirm('Seguro que deseas borrar el usuario ' + currentUser[0].name + '?');
    if (borrado) {
      let alert_res: AlertResponse;
      try {
        const res = await this.userServices.deleteByID(id);
        if ('id_user' in res && res.id_user === id) {
          alert_res = {title: 'Great!', text: 'User with ID: ' + id + ' succesfully removed', icon: 'success', cbutton: 'Accept'}
        } else {
          let text: string;
          text = ('error' in res) ?  'Error' : 'User with ID: ' + id + ' not found'
          alert_res = {title: 'Error!', text: text, icon: 'error', cbutton: 'Accept'}
        }
      } catch (error) {
        console.log(error);
        alert_res = {title: 'Error!', text: 'Error', icon: 'error', cbutton: 'Accept'}
      }
      Swal.fire(alert_res)
    }
  }

}
