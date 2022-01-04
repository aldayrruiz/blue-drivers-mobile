import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/core/models';
import { EditUser } from 'src/app/core/models/edit/edit.user.models';
import {
  Ghost,
  Key,
  LoadingService,
  SnackerService,
  StorageService,
  UserService,
} from 'src/app/core/services';
import {
  emailValidators,
  fullnameValidators,
  passwordValidators,
} from 'src/app/shared/utils/validators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss', '../../../styles.css'],
})
export class EditUserPage implements OnInit {
  profile: FormGroup;
  user: User;

  constructor(
    private loadingSrv: LoadingService,
    private alertCtrl: AlertController,
    private snacker: SnackerService,
    private storage: StorageService,
    private ghost: Ghost,
    private route: ActivatedRoute,
    private userSrv: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.resolveData();
  }

  resolveData() {
    this.route.data.subscribe((data) => {
      this.profile = this.getProfile(data.user);
    });
  }

  getProfile(user: User): FormGroup {
    return this.fb.group({
      fullname: [user.fullname, fullnameValidators],
      email: [user.email, emailValidators],
      password: ['', passwordValidators],
      password2: ['', passwordValidators],
    });
  }

  async edit() {
    await this.loadingSrv.present();

    if (!this.passwordsMatch()) {
      await this.loadingSrv.dismiss();
      const alert = await this.alertCtrl.create({
        message: 'Las contraseñas NO son iguales.',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }

    const userUpdated = this.getEditUser();
    const userStored = await this.storage.getParsed(Key.user);

    this.userSrv
      .update(userStored.id, userUpdated)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          await this.ghost.goBack(this.route);
          const msg = 'Se ha editado con exito.';
          await this.snacker.showSuccessful(msg);
        },
        async () => {
          const msg = 'Un error ha ocurrido.';
          this.snacker.showFailed(msg);
        }
      );
  }

  get email(): AbstractControl {
    return this.profile.get('email');
  }

  get fullname(): AbstractControl {
    return this.profile.get('fullname');
  }

  get password(): AbstractControl {
    return this.profile.get('password');
  }

  get password2(): AbstractControl {
    return this.profile.get('password2');
  }

  private passwordsMatch() {
    return this.profile.value.password === this.profile.value.password2;
  }

  private getEditUser(): EditUser {
    return {
      email: this.profile.value.email,
      fullname: this.profile.value.fullname,
      password: this.profile.value.password,
    };
  }
}
