import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPago',
  standalone: true
})
export class EstadoPagoPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
   switch(value){
    case 'paid': return 'Pagado';
      case 'unpaid': return 'no pagado';
      case 'pending': return 'pendiente';
      default: return value;
   }
  }

}
