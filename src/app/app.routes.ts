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


export const routes: Routes = [
    {path:'', pathMatch:'full', redirectTo:'login'},
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardComponent,children:[
        {path:'dashboardoperator',component:DashboardoperatorComponent,children:[
            {path: 'orderList',component:OrderTableComponent},
            {path:'orderForm/:id',component:OrderFormComponent},
        ]},
        {path:'dashboardmanager',component:DashboardmanagerComponent,children:[
            {path:'orderList',component:OrderTableComponent},
            {path:'orderForm/:id',component:OrderFormComponent},
        ]},
        {path:'dashboardboss',component:DashboardbossComponent,children:[
            {path:'warehouseview/:id',component:WarehouseViewComponent},
            {path:'warehouseform/:id',component:WarehouseFormComponent},
        ]},  
    ]},
    {path:'**', redirectTo:'login'}
];
