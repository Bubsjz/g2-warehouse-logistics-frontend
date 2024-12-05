import { Component, inject, Input } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';
import { Iwarehouse2 } from '../../interfaces/iwarehouse2.interface';
import { Iuser2 } from '../../interfaces/iuser2.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './warehouse-card.component.html',
  styleUrl: './warehouse-card.component.css'
})

export class WarehouseCardComponent {
  warehouseServices = inject(WarehousesService);
  userServices = inject(UsersService);
  router = inject(Router)

  @Input() warehouse_id!: number;

  // warehouse: Iwarehouse | undefined;
  // operators: Iuser[] | undefined;
  // managers: Iuser[] | undefined;

  warehouse: Iwarehouse2 | undefined;
  operators: Iuser2[] | undefined;
  managers: Iuser2[] | undefined;
  n_operators: number = 0;
  n_managers: number = 0;
  n_employees: number = 0;


  async ngOnInit() {

    const res = await this.warehouseServices.getById(this.warehouse_id)
    this.warehouse = res

    // const res2 = await this.userServices.getByWarehouseId(this.warehouse_id)

    this.managers = res.users!.filter(employee => employee.role === 'manager')
    this.operators = res.users!.filter(employee => employee.role === 'operator')
    this.n_operators = this.operators!.length
    this.n_managers = this.managers!.length
    this.n_employees = this.n_managers + this.n_operators
  }

  deleteWarehouse(id_warehouse:number){
    Swal.fire({
      title: `Are you sure?`,
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `No eliminar`,
      confirmButtonColor: '#4caf50',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let variable = id_warehouse;
        const response = await this.warehouseServices.delete(variable);
        if (response.id_warehouse) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${response.name} has been eliminated` ,
            showConfirmButton: false,
            timer: 2500,
            background: '#4caf50',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
            
          });
          this.router.navigate(['/boss','warehouse-info'])
        }
      }
    })
  }
}