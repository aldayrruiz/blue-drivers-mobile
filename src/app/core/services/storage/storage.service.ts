import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

export enum Key {
  user = 'user',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  async remove(key: Key) {
    return Storage.remove({ key });
  }

  async get(key: string) {
    return Storage.get({ key }).then((value) => value.value);
  }

  async set(key: string, value: string) {
    return Storage.set({ key, value });
  }

  async setStringify(key: string, value: any) {
    const stringified = JSON.stringify(value);
    return this.set(key, stringified);
  }

  async getParsed(key: string) {
    return JSON.parse(await this.get(key));
  }
}
