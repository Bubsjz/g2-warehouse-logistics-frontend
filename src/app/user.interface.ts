export interface iUser {
    id_user: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    rol: 'administrator' | 'manager' | 'driver';
    asigned_id_warehouse: number;
  }