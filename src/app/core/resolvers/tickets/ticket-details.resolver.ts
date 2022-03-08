import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Ticket } from 'src/app/core/models';
import { TicketService } from 'src/app/core/services';
import { LoadingService } from '../../services/view/loading.service';

@Injectable({
  providedIn: 'root',
})
export class TicketDetailsResolver implements Resolve<Ticket> {
  constructor(
    private service: TicketService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Ticket> {
    await this.loadingSrv.present();
    const ticketId = route.params.ticketId;
    return this.service
      .get(ticketId)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
