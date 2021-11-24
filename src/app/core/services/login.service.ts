import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ApiPaths } from 'src/app/shared/api-paths.enum';
import { environment } from 'src/environments/environment';
import { FastStorageService, UserData } from './fast-storage.service';
import { Key, StorageService } from './storage.service';

interface LoginResponse {
  token: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  user_id: string;
  email: string;
  fullname: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private fastStorage: FastStorageService
  ) {
    this.loadStorageVariables();
  }

  async loadStorageVariables(): Promise<void> {
    console.log('Loading storage variables...');
    this.storage.getAllFrom([Key.user]).subscribe((values: string[]) => {
      const [userJson] = values;

      const user = JSON.parse(userJson);

      if (user) {
        this.fastStorage.setUserData(user);
        this.isAuthenticated.next(true);
      } else {
        this.isAuthenticated.next(false);
      }
    });
    console.log('Ending loading storage variables.');
  }

  login(credentials: {
    username: string;
    password: string;
    // serverUrl: string;
  }): Observable<void[]> {
    console.log('Login...');
    // const serverUrl = credentials.serverUrl.trim();
    const path = `${environment.fleetBaseUrl}${ApiPaths.login}/`;
    return this.http.post<LoginResponse>(path, credentials).pipe(
      switchMap((data: LoginResponse) => {
        const userData = this.getUserDataFromResponse(data);
        this.fastStorage.setUserData(userData);

        return this.storage.setAll([
          { key: Key.user, value: JSON.stringify(userData) },
          // { key: Key.serverUrl, value: serverUrl },
        ]);
      }),
      tap((_) => {
        this.isAuthenticated.next(true);
      })
    );
  }

  logout(): Observable<void> {
    this.isAuthenticated.next(false);
    this.fastStorage.removeUser();
    return this.storage.remove(Key.user);
  }

  private getUserDataFromResponse(response: LoginResponse): UserData {
    const result: UserData = {
      id: response.user_id,
      email: response.email,
      fullname: response.fullname,
      role: response.role,
      token: response.token,
    };
    return result;
  }
}
