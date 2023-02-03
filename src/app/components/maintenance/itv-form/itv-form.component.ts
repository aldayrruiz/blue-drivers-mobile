import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addYears } from 'date-fns';
import { DateZonerHelper } from 'src/app/core/services';
import { DateComponent } from '../../date/date.component';

@Component({
  selector: 'app-itv-form',
  templateUrl: './itv-form.component.html',
  styleUrls: ['./itv-form.component.scss'],
})
export class ItvFormComponent implements OnInit {
  @ViewChild('nextRevision') nextRevisionDateTimeComponent: DateComponent;

  initDate: string;
  form: FormGroup;

  constructor(private fb: FormBuilder, private zoner: DateZonerHelper) {}

  get place(): AbstractControl {
    return this.form.get('place');
  }

  get passed(): AbstractControl {
    return this.form.get('passed');
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.initDates();
  }

  getData() {
    const place: string = this.place.value;
    const passed: boolean = this.passed.value;
    const next_revision = this.nextRevisionDateTimeComponent.getDateSerialized();
    return { place, passed, next_revision };
  }

  getErrors() {
    const errors = [];
    if (this.place.invalid) {
      errors.push('El lugar es requerido');
    }
    if (this.passed.invalid) {
      errors.push('El resultado es requerido');
    }
    return errors;
  }

  private initFormGroup() {
    this.form = this.fb.group({
      place: ['', [Validators.required]],
      passed: ['', [Validators.required]],
    });
  }

  private initDates() {
    const now = new Date();
    const nextYear = addYears(now, 1);
    this.initDate = this.zoner.toMyZone(nextYear);
  }
}
