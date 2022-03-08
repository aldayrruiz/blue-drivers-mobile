import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Ticket } from '../../models';
import { LoadingService, TicketService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class MyTicketsResolver implements Resolve<Ticket[]> {
  constructor(private service: TicketService, private loadingSrv: LoadingService) {}

  async resolve(): Promise<Ticket[]> {
    await this.loadingSrv.present();
    return this.service
      .getAll()
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
