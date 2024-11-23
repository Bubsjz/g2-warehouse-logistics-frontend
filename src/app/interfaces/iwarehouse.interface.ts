import { Iuser } from "./iuser.interface";

export interface Iwarehouse {
    id?: number;
    name: string;
    locality: string;
    address: string;
    image: string;
    employees: Iuser[];
}
