import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


export const routes: Routes = [
    {path:'', pathMatch:'full', redirectTo:'login'},
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardComponent,children:[
       

    ]},
    {path:'**', redirectTo:'login'}
];
