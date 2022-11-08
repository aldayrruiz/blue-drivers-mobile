import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TenantStorage, UserStorage } from '../../models';

export enum Key {
  user = 'user',
  tenant = 'tenant',
  login = 'login',
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor() {}

  async storeUser(user: UserStorage) {
    const stringified = JSON.stringify(user);
    return this.store(Key.user, stringified);
  }

  async getUser() {
    return JSON.parse(await this.get(Key.user));
  }

  async storeTenant(tenant: TenantStorage) {
    const stringified = JSON.stringify(tenant);
    return this.store(Key.tenant, stringified);
  }

  async getTenant(): Promise<TenantStorage> {
    return JSON.parse(await this.get(Key.tenant));
  }

  async storeLogin(login: { email: string; rememberEmail: boolean }) {
    const stringified = JSON.stringify(login);
    return this.store(Key.login, stringified);
  }

  async getLoginEmail() {
    return JSON.parse(await this.get(Key.login));
  }

  async clearAll() {
    return await Preferences.clear();
  }

  async clearOnlyAuthRelated() {
    await Preferences.remove({ key: Key.user });
    await Preferences.remove({ key: Key.tenant });
  }

  async clearOnlyLogin() {
    await Preferences.remove({ key: Key.login });
  }

  private async store(key: string, value: string) {
    return Preferences.set({ key, value });
  }

  private async get(key: string) {
    return Preferences.get({ key }).then((value) => value.value);
  }
}
