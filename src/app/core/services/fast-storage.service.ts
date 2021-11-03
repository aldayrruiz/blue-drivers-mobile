import { Injectable } from '@angular/core';

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
    return this.serverUrl;
  }

  setAll(user: UserData, serverUrl: string): void {
    this.user = user;
    this.serverUrl = serverUrl;
  }

  removeUser(): void {
    this.user = undefined;
  }
}
