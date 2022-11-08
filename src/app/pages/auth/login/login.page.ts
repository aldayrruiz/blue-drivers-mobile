import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Role, Tenant } from 'src/app/core/models';
import {
  ErrorMessageService,
  LoadingService,
  LoginService,
  StorageService,
  TenantService,
} from 'src/app/core/services';
import { emailValidators, passwordValidators } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  tenants: Tenant[] = [];
  tenantToChange: string;
  credentials: FormGroup;
  submitted = false;
  isSuperAdmin: boolean;

  constructor(
    private errorMessage: ErrorMessageService,
    private alertController: AlertController,
    private tenantService: TenantService,
    private loginService: LoginService,
    private loadingSrv: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private storage: StorageService
  ) {}

  get username(): AbstractControl {
    return this.credentials.get('username');
  }

  get password(): AbstractControl {
    return this.credentials.get('password');
  }

  get rememberEmail(): AbstractControl {
    return this.credentials.get('rememberEmail');
  }

  async ngOnInit() {
    await this.initFormGroup();
  }

  async login(): Promise<void> {
    await this.loadingSrv.present();

    const isConnected = await this.showDialogIfNoConnection();

    if (!isConnected) {
      return;
    }

    const credentials = this.getCredentials();

    if (this.rememberEmail.value) {
      await this.storage.storeLogin({
        email: this.username.value,
        rememberEmail: this.rememberEmail.value,
      });
    } else {
      console.log('Clearing data login');
      await this.storage.clearOnlyLogin();
    }

    this.loginService
      .login(credentials)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (user) => {
          if (user.role === Role.SUPER_ADMIN) {
            this.getAndSetDefaultTenant(user.tenant.id);
            this.isSuperAdmin = true;
          } else {
            this.router.navigateByUrl('/members', { replaceUrl: true });
          }
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

  async changeTenant() {
    this.tenantService
      .changeTenant(this.tenantToChange)
      .subscribe(() => this.router.navigateByUrl('/members', { replaceUrl: true }));
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

  private async initFormGroup() {
    this.credentials = this.fb.group({
      username: ['', emailValidators],
      password: ['', passwordValidators],
      rememberEmail: [false, passwordValidators],
    });

    const login = await this.storage.getLoginEmail();

    if (login) {
      this.username.setValue(login.email);
      this.rememberEmail.setValue(login.rememberEmail);
    }
  }

  private getCredentials() {
    return {
      username: this.username.value,
      password: this.password.value,
    };
  }

  private getAndSetDefaultTenant(tenant: string) {
    this.tenantService.getAll().subscribe((tenants) => {
      this.tenantToChange = tenant;
      this.tenants = tenants;
    });
  }
}
