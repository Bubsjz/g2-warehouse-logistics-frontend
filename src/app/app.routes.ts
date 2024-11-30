import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardoperatorComponent } from './pages/dashboardoperator/dashboardoperator.component';
import { OrderTableComponent } from './pages/order-table/order-table.component';
import { OrderFormComponent } from './pages/order-form/order-form.component';
import { DashboardmanagerComponent } from './pages/dashboardmanager/dashboardmanager.component';
import { DashboardbossComponent } from './pages/dashboardboss/dashboardboss.component';
import { WarehouseFormComponent } from './pages/warehouse-form/warehouse-form.component';
import { WarehouseViewComponent } from './pages/warehouse-view/warehouse-view.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { EmployeeViewComponent } from './pages/employee-view/employee-view.component';


export const routes: Routes = [
    {path:'', pathMatch:'full', redirectTo:'login'},
    {path:'login', component:LoginComponent},
    {path:'operator',component:DashboardoperatorComponent,children:[
            {path:'order-list',component:OrderTableComponent},
            {path:'create-order',component:OrderFormComponent},
            {path:'modify-order/:id',component:OrderFormComponent},
        ]},
    {path:'manager',component:DashboardmanagerComponent,children:[
            {path:'order-list',component:OrderTableComponent},
            {path:'review-order/:id',component:OrderFormComponent},
        ]},
    {path:'boss',component:DashboardbossComponent,children:[
            {path:'warehouse-info',component: NavbarComponent},
            {path:'warehouse-view/:id',component:WarehouseViewComponent},
            {path:'warehouse-form',component:WarehouseFormComponent},
            {path:'update-employee/:id',component:UserFormComponent},
            {path:'new-employee',component:UserFormComponent},
            {path:'employee-view/:id',component:EmployeeViewComponent}

        ]},
    {path:'**', redirectTo:'login'}
];
