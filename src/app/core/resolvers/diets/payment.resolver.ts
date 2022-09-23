import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Payment } from 'src/app/core/models';
import { LoadingService } from '../../services';
import { DietService } from '../../services/api/diet.service';

@Injectable({
  providedIn: 'root',
})
export class DietPaymentResolver implements Resolve<Payment> {
  constructor(private dietService: DietService, private loadingSrv: LoadingService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Payment> {
    await this.loadingSrv.present();
    const dietId = route.params.dietId;
    return this.dietService
      .getPayment(dietId)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
