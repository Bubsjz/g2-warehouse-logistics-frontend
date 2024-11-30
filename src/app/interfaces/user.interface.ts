export interface User {
    id_user:              number;
    name:                 string;
    surname:              string;
    email:                string;
    password:             string;
    role:                  role;
    asigned_id_warehouse: number;
}

export enum role {
    administrator = "administrator",
    operator = "operator",
    manager = "manager",
}

export interface iUser {
    id_user: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: 'boss' | 'manager' | 'operator';
    asigned_id_warehouse: number;
    token?: string;
  }