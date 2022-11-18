import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { API } from 'src/app/core/utils/api-paths.enum';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../../models/auth/login-response.model';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private storage: StorageService, private http: HttpClient) {}

  login(body: { username: string; password: string }) {
    const path = `${environment.fleetBaseUrl}${API.login}/`;
    return this.http.post<LoginResponse>(path, body).pipe(
      switchMap(async (response) => {
        const user = await this.storeUser(response);
        await this.storeTenant(response);
        return user;
      })
    );
  }

  async logout() {
    await this.storage.clearOnlyAuthRelated();
  }

  private async storeUser(response: LoginResponse) {
    const user = {
      id: response.user_id,
      email: response.email,
      fullname: response.fullname,
      role: response.role,
      token: response.token,
      tenant: response.tenant,
    };
    await this.storage.storeUser(user);
    return user;
  }

  private async storeTenant(response: LoginResponse) {
    await this.storage.storeTenant(response.tenant);
  }
}
