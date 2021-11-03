import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum Key {
  user = 'user',
  serverUrl = 'serverUrl',
}

export interface KeyValue {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  get(key: string): Observable<string> {
    return from(Storage.get({ key })).pipe(map((data) => data.value));
  }

  set(keyValue: KeyValue): Observable<void> {
    return from(Storage.set(keyValue));
  }

  getAllFrom(keys: string[]): Observable<string[]> {
    return from(Promise.all(keys.map((key: string) => this.getP(key))));
  }

  setAll(keyValues: KeyValue[]): Observable<void[]> {
    return from(
      Promise.all(keyValues.map((keyValue: KeyValue) => this.setP(keyValue)))
    );
  }

  remove(key: Key): Observable<void> {
    return from(Storage.remove({ key }));
  }

  removeAll(): Observable<void[]> {
    return from(
      Promise.all([
        Storage.remove({ key: Key.user }),
        Storage.remove({ key: Key.serverUrl }),
      ])
    );
  }

  async getP(key: string): Promise<string> {
    return Storage.get({ key }).then((value) => value.value);
  }

  private setP(keyValue: KeyValue): Promise<void> {
    return Storage.set(keyValue);
  }
}
