import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerUrlService } from '..';

@Injectable({
  providedIn: 'root',
})
export class PasswordRecover {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  recover(email: string) {
    const body = { email };
    const path = `${this.urlSrv.getUsers()}/create_recover_password/`;
    return this.http.post(path, body);
  }

  confirm(recoverPasswordId: string, code: string) {
    const body = { code };
    const path = `${this.urlSrv.getUsers()}/${recoverPasswordId}/confirm_recover_password/`;
    return this.http.put(path, body);
  }
}
