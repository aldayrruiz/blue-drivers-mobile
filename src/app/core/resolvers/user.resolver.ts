import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/core/models';
import { FastStorageService } from 'src/app/core/services/fast-storage.service';
import { UserService } from 'src/app/core/services/user.service';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(
    private userSrv: UserService,
    private fastStorage: FastStorageService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(): Promise<User> {
    await this.loadingSrv.present();
    const userData = this.fastStorage.getUser();
    return this.userSrv
      .get(userData.id)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
