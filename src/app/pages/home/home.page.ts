import { Component, OnInit } from '@angular/core';
import { AppUpdate, AppUpdateInfo } from '@capawesome/capacitor-app-update';
import { Platform } from '@ionic/angular';
import { homeButtons } from './home-buttons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  toolbarTitle = 'Home';
  buttons = homeButtons;
  public appUpdateInfo: AppUpdateInfo | undefined;

  private readonly GH_URL = 'https://github.com/robingenz/capacitor-app-update';

  constructor(private readonly platform: Platform) {}

  ngOnInit() {
    if (!this.platform.is('capacitor')) {
      return;
    }
    AppUpdate.getAppUpdateInfo().then((appUpdateInfo) => {
      this.appUpdateInfo = appUpdateInfo;
      console.log('appUpdateInfo', appUpdateInfo);
      this.openAppStore();
    });
  }

  public openOnGithub(): void {
    window.open(this.GH_URL, '_blank');
  }

  public async openAppStore(): Promise<void> {
    await AppUpdate.openAppStore();
  }

  public async performImmediateUpdate(): Promise<void> {
    await AppUpdate.performImmediateUpdate();
  }

  public async startFlexibleUpdate(): Promise<void> {
    await AppUpdate.startFlexibleUpdate();
  }

  public async completeFlexibleUpdate(): Promise<void> {
    await AppUpdate.completeFlexibleUpdate();
  }
}
