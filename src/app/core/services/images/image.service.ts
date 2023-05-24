import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  toBase64(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error: ProgressEvent<FileReader>) => reject(error);
    });
  }

  getFullUrl(path: string): string {
    if (!path) {
      return null;
    }
    return environment.fleetBaseUrl + path;
  }
}
