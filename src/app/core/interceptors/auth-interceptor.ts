import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FastStorageService } from '../services/fast-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private fastStorage: FastStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userData = this.fastStorage.getUser();
    const authToken = userData !== undefined ? userData.token : '';
    if (authToken) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      req = req.clone({ setHeaders: { Authorization: `Token ${authToken}` } });
    } else {
      req = req.clone();
    }

    return next.handle(req);
  }
}
