import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { iUser } from '../../interfaces/user-view.interface';
import { iWarehouse } from '../../interfaces/warehouse-user-view.interface';
import { UsersService } from '../../services/users.service';
import { Iuser4 } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.css'
})

export class EmployeeViewComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute)
  userServices = inject(UsersService)
  myUser: Iuser4 | undefined;
  
  ngOnInit() {

    this.activatedRoute.params.subscribe(async (params: any) => {
    const res = await this.userServices.getById(params.id);
    console.log(res)
    this.myUser = res;

    })
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