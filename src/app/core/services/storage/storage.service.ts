import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TenantStorage, UserStorage } from '../../models';

export enum Key {
  user = 'user',
  tenant = 'tenant',
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

  async clearAll() {
    return await Preferences.clear();
  }

  private async store(key: string, value: string) {
    return Preferences.set({ key, value });
  }

  private async get(key: string) {
    return Preferences.get({ key }).then((value) => value.value);
  }
}
