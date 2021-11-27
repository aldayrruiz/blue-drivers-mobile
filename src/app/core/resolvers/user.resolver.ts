import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/core/models';
import { UserService } from 'src/app/core/services/user.service';
import { Key, StorageService } from '../services';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(
    private userSrv: UserService,
    private storage: StorageService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(): Promise<User> {
    await this.loadingSrv.present();
    const user = await this.storage.getParsed(Key.user);
    return this.userSrv
      .get(user.id)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
