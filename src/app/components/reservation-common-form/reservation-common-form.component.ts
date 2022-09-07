import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReservationTemplate } from 'src/app/core/models';
import { descriptionValidators, titleValidators } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-reservation-common-form',
  templateUrl: './reservation-common-form.component.html',
  styleUrls: ['./reservation-common-form.component.scss'],
})
export class ReservationCommonFormComponent implements OnInit {
  form: FormGroup;
  reservationTemplates: ReservationTemplate[] = [];

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.resolveData();
  }

  private initFormGroup() {
    this.form = this.fb.group({
      title: ['', titleValidators],
      description: ['', descriptionValidators],
    });
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.reservationTemplates = response.reservationTemplates;
    });
  }
}
