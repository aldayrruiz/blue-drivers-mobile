import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addYears } from 'date-fns';
import { WheelsLocation, WheelsOperation } from 'src/app/core/models';
import { DateZonerHelper } from 'src/app/core/services';
import { DateComponent } from '../../date/date.component';

@Component({
  selector: 'app-wheels-form',
  templateUrl: './wheels-form.component.html',
  styleUrls: ['./wheels-form.component.scss'],
})
export class WheelsFormComponent implements OnInit {
  @ViewChild('nextRevision') datetimeComponent: DateComponent;
  initNextRevision: string;
  form: FormGroup;

  constructor(private fb: FormBuilder, private zoner: DateZonerHelper) {}

  get location(): AbstractControl {
    return this.form.get('location');
  }

  get kilometers(): AbstractControl {
    return this.form.get('kilometers');
  }

  get operation(): AbstractControl {
    return this.form.get('operation');
  }

  get passed(): AbstractControl {
    return this.form.get('passed');
  }

  get nextKilometers(): AbstractControl {
    return this.form.get('nextKilometers');
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.initDates();
  }

  getData() {
    const location: WheelsLocation = this.location.value;
    const kilometers: number = this.kilometers.value;
    const operation: WheelsOperation = this.operation.value;
    const passed: boolean = this.passed.value;
    const next_kilometers: number = this.nextKilometers.value;
    const next_revision = this.datetimeComponent.getDateSerialized();
    return { location, kilometers, operation, passed, next_revision, next_kilometers };
  }

  getErrors() {
    const errors = [];
    if (this.location.getError('required')) {
      errors.push('La ubicación es requerida');
    }
    if (this.kilometers.getError('required')) {
      errors.push('Los kilómetros son requeridos');
    }
    if (this.kilometers.getError('min')) {
      errors.push('Los kilómetros deben ser mayor o igual que 0');
    }
    if (this.operation.getError('required')) {
      errors.push('La operación es requerida');
    }
    if (this.passed.getError('required')) {
      errors.push('El resultado es requerido');
    }
    if (this.operation.value === WheelsOperation.Substitution) {
      if (this.nextKilometers.getError('required')) {
        errors.push('Los kilómetros para la próxima revisión son requeridos');
      }
      if (this.nextKilometers.getError('min')) {
        errors.push('Los kilómetros para la próxima revisión deben ser mayor o igual que 0');
      }
    }
    return errors;
  }

  private initFormGroup() {
    this.form = this.fb.group({
      location: ['', [Validators.required]],
      kilometers: [null, [Validators.required, Validators.min(0)]],
      operation: ['', [Validators.required]],
      passed: [null, [Validators.required]],
      nextKilometers: [null, [Validators.required, Validators.min(0)]],
    });
  }

  private initDates() {
    const now = new Date();
    const nextYear = addYears(now, 1);
    this.initNextRevision = this.zoner.toMyZone(nextYear);
  }
}
