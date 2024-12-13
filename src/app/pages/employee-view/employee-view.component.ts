import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { iUser } from '../../interfaces/user-view.interface';
import { iWarehouse } from '../../interfaces/warehouse-user-view.interface';
import { UsersService } from '../../services/users.service';
import { Iuser4 } from '../../interfaces/iuser.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';

type AlertResponse = { title: string; text: string; icon: SweetAlertIcon, cbutton: string};

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.css'
})

export class EmployeeViewComponent implements OnInit {
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  userServices = inject(UsersService)
  myUser: Iuser4 | undefined;
  userID: number = 0;
  
  ngOnInit() {

    this.activatedRoute.params.subscribe(async (params: any) => {
    const res = await this.userServices.getById(params.id);
    this.userID = Number(params!.id)
    this.myUser = res;

    })
  }

  delete(id: number) {
    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to removed user with ID: ' + id + ' ?',
      icon: 'warning',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
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
        this.router.navigate(['/boss', 'warehouse-view', this.myUser?.assigned_id_warehouse])
      }
    });
  }

  // userInfo: iUser | null = null;
  // warehouseInfo: iWarehouse | null = null;

  // constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  // ngOnInit(): void {
  //   const userId = Number(this.route.snapshot.paramMap.get('id'));
  //   this.userService.getUserWithWarehouse(userId).subscribe({
  //     next: ({ user, warehouse }) => {
  //       this.userInfo = user;
  //       this.warehouseInfo = warehouse;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching data:', err);
  //     },
  //   });
  // }

  // deleteUser(): void {
  //   if (this.userInfo) {
  //     const confirmed = confirm(`¿Are you sure you want to remove ${this.userInfo.name} ${this.userInfo.surname}?`);
  
  //     if (confirmed) {
  //       this.userService.deleteUser(this.userInfo.id_user).subscribe({
  //         next: () => {
  //           alert('User deleted successfully.');
  //           this.router.navigate(['/dashboard/boss/employee-view']);
  //         },
  //         error: (err) => {
  //           console.error('Error deleting user:', err);
  //           alert('An error occurred while deleting the user.');
  //         },
  //       });
  //     }
  //   } else {
  //     alert('No user information was found for deletion.');
  //   }
  // }

}