import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/services';
import { homeButtons } from './home-buttons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  toolbarTitle = 'Home';
  buttons = homeButtons;
  user: any;

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    const user = await this.storage.getUser();
    this.user = user;
  }
}
