export interface User {
    id_user:              number;
    name:                 string;
    surname:              string;
    email:                string;
    password:             string;
    rol:                  Rol;
    asigned_id_warehouse: number;
}

export enum Rol {
    Administrator = "administrator",
    Driver = "driver",
    Manager = "manager",
}

export interface iUser {
    id_user: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: 'boss' | 'manager' | 'driver';
    asigned_id_warehouse: number;
    token?: string;
  }