import { Region } from './region';
import { Factura } from '../facturas/models/factura';
export class Cliente {
    id: number;
    nombres: string;
    apellidos: string;
    createAt: string;
    email: string;
    foto: string;
    region: Region;
    factura: Array<Factura> = [];
}
