import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/core/models';
import { EditUser } from 'src/app/core/models/edit/edit.user.models';
import {
  FastStorageService,
  LoadingService,
  SnackerService,
  UserService,
} from 'src/app/core/services';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss', '../../../styles.css'],
})
export class EditUserPage implements OnInit {
  profile: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userSrv: UserService,
    private alertCtrll: AlertController,
    private fastStorage: FastStorageService,
    private snacker: SnackerService,
    private loadingSrv: LoadingService
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
      fullname: [user.fullname, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async edit(): Promise<void> {
    await this.loadingSrv.present();

    if (!this.passwordsMatch()) {
      await this.loadingSrv.dismiss();
      const alert = await this.alertCtrll.create({
        message: 'Las contraseñas NO son iguales.',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }

    const data = this.getEditUser();

    const userData = this.fastStorage.getUser();

    this.userSrv
      .update(userData.id, data)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async () => {
          const message = 'Se ha editado con exito.';
          const toast = await this.snacker.createSuccessful(message);
          await toast.present();
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        async () => {
          const message = 'Un error ha ocurrido.';
          const toast = await this.snacker.createFailed(message);
          await toast.present();
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

  passwordsMatch(): boolean {
    return this.profile.value.password === this.profile.value.password2;
  }

  private getEditUser(): EditUser {
    const email = this.profile.value.email;
    const fullname = this.profile.value.fullname;
    const password = this.profile.value.password;

    const editUser: EditUser = {
      email,
      fullname,
      password,
    };

    return editUser;
  }
}
