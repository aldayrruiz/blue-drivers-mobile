import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface UserData {
  id: string;
  email: string;
  fullname: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class FastStorageService {
  private user: UserData;
  private serverUrl = '';

  constructor() {}

  getUser(): UserData {
    return this.user;
  }

  getBaseUrl(): string {
    return environment.fleetBaseUrl;
  }

  setAll(user: UserData, serverUrl: string): void {
    this.setUserData(user);
    this.serverUrl = serverUrl;
  }

  setUserData(user: UserData): void {
    this.user = user;
  }

  removeUser(): void {
    this.user = undefined;
  }
}
