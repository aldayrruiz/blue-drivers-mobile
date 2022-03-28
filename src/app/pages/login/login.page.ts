import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import {
  ErrorMessageService,
  LoadingService,
  LoginService,
  PasswordRecover,
} from 'src/app/core/services';
import { emailValidators, passwordValidators } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  submitted = false;

  constructor(
    private errorMessage: ErrorMessageService,
    private passwordRecover: PasswordRecover,
    private alertController: AlertController,
    private loginService: LoginService,
    private loadingSrv: LoadingService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  get username(): AbstractControl {
    return this.credentials.get('username');
  }

  get password(): AbstractControl {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.initFormGroup();
  }

  async login(): Promise<void> {
    await this.loadingSrv.present();

    const isConnected = await this.showDialogIfNoConnection();

    if (!isConnected) {
      return;
    }

    const credentials = this.getCredentials();

    this.loginService
      .login(credentials)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          this.router.navigateByUrl('/members', { replaceUrl: true });
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          const alert = await this.alertController.create({
            header: 'Login failed',
            message,
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
  }

  async forgotPassword() {
    this.passwordRecover.recover('email.com');
  }

  /**
   * Show a dialog if no connection to internet is available.
   *
   * @returns true if connected to Internet. Otherwise, returns false
   */
  private async showDialogIfNoConnection() {
    const status = await Network.getStatus();

    if (status.connected) {
      return true;
    }

    await this.loadingSrv.dismiss();
    const alert = await this.alertController.create({
      header: 'Login failed',
      message: 'No tienes conexión a internet.',
      buttons: ['OK'],
    });

    await alert.present();
    return false;
  }

  private initFormGroup() {
    this.credentials = this.fb.group({
      username: ['', emailValidators],
      password: ['', passwordValidators],
    });
  }

  private getCredentials() {
    return {
      username: this.username.value,
      password: this.password.value,
    };
  }
}
