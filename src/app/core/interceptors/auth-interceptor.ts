import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Key, StorageService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // convert promise to observable using 'from' operator
    return from(this.handle(req, next));
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    const user = await this.storage.getParsed(Key.user);
    const token = user ? user.token : '';
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const tokenHeaders = { setHeaders: { Authorization: `Token ${token}` } };
    req = req.clone(token ? tokenHeaders : {});
    return next.handle(req).toPromise();
  }
}
