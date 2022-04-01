import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { API } from 'src/app/core/utils/api-paths.enum';
import { environment } from 'src/environments/environment';
import { Role } from '../../models';
import { Key, StorageService } from '../storage/storage.service';

interface LoginResponse {
  token: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  user_id: string;
  email: string;
  fullname: string;
  role: Role;
  tenant: string;
}

interface UserData {
  id: string;
  email: string;
  fullname: string;
  role: Role;
  token: string;
  tenant: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  isAuth: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private storage: StorageService, private http: HttpClient) {
    this.loadStorageVariables();
  }

  async loadStorageVariables() {
    const user = await this.storage.getParsed(Key.user);
    this.isAuth.next(Boolean(user));
  }

  login(body: { username: string; password: string }) {
    const path = `${environment.fleetBaseUrl}${API.login}/`;
    return this.http.post<LoginResponse>(path, body).pipe(
      switchMap(async (response: LoginResponse) => {
        const user = this.transformToUser(response);
        await this.storage.setStringify(Key.user, user);
        return user;
      }),
      tap((_) => {
        this.isAuth.next(true);
      })
    );
  }

  async logout() {
    this.isAuth.next(false);
    await this.storage.remove(Key.user);
  }

  private transformToUser(response: LoginResponse): UserData {
    return {
      id: response.user_id,
      email: response.email,
      fullname: response.fullname,
      role: response.role,
      token: response.token,
      tenant: response.tenant,
    };
  }
}
