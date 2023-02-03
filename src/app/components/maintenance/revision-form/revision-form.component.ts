import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addYears } from 'date-fns';
import { DateZonerHelper } from 'src/app/core/services';
import { DatetimeComponent } from '../../datetime/datetime.component';

@Component({
  selector: 'app-revision-form',
  templateUrl: './revision-form.component.html',
  styleUrls: ['./revision-form.component.scss'],
})
export class RevisionFormComponent implements OnInit {
  @ViewChild('nextRevision') datetimeComponent: DatetimeComponent;
  initNextRevision: string;

  form: FormGroup;

  constructor(private fb: FormBuilder, private zoner: DateZonerHelper) {}

  get kilometers(): AbstractControl {
    return this.form.get('kilometers');
  }

  get motive(): AbstractControl {
    return this.form.get('motive');
  }

  get garage(): AbstractControl {
    return this.form.get('garage');
  }

  get nextKilometers(): AbstractControl {
    return this.form.get('nextKilometers');
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.initDates();
  }

  getData() {
    const kilometers: number = this.kilometers.value;
    const motive: string = this.motive.value;
    const garage: string = this.garage.value;
    const next_revision = this.datetimeComponent.getDateSerialized();
    const next_kilometers: number = this.nextKilometers.value;
    return { kilometers, motive, garage, next_revision, next_kilometers };
  }

  getErrors() {
    const errors = [];
    if (this.kilometers.getError('required')) {
      errors.push('Los kilómetros son requeridos');
    }
    if (this.kilometers.getError('min')) {
      errors.push('Los kilómetros deben ser mayor o igual que 0');
    }
    if (this.motive.getError('required')) {
      errors.push('El motivo es requerido');
    }
    if (this.garage.getError('required')) {
      errors.push('El taller es requerido');
    }
    if (this.nextKilometers.getError('required')) {
      errors.push('Los kilómetros próximos son requeridos');
    }
    if (this.nextKilometers.getError('min')) {
      errors.push('Los kilómetros próximos deben ser mayor o igual que 0');
    }
    return errors;
  }

  private initFormGroup() {
    this.form = this.fb.group({
      kilometers: [null, [Validators.required, Validators.min(0)]],
      motive: ['', [Validators.required]],
      garage: ['', [Validators.required]],
      nextKilometers: [null, [Validators.required, Validators.min(0)]],
    });
  }

  private initDates() {
    const now = new Date();
    const nextYear = addYears(now, 1);
    this.initNextRevision = this.zoner.toMyZone(nextYear);
  }
}
