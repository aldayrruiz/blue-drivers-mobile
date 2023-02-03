import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  photos: string[] = [];
  constructor() {}

  ngOnInit(): void {}

  async addPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });

      this.photos.push(image.dataUrl);
    } catch (error) {
      console.log('User did not take a photo');
    }
  }

  removePhoto(i: number) {
    this.photos.splice(i, 1);
  }
}
