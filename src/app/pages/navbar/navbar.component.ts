import { Component, inject } from '@angular/core';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { RouterLink } from '@angular/router';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  warehouseServices = inject(WarehousesService)
  warehouses: Iwarehouse[] | undefined = [];

  async ngOnInit() {
    try {
      const res = await this.warehouseServices.getAll();
      this.warehouses = res
    } catch (error) {
      console.log(error)
    }
  }
}