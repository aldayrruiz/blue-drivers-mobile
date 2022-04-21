import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datetime-modal',
  templateUrl: './datetime-modal.component.html',
  styleUrls: ['./datetime-modal.component.scss'],
})
export class DatetimeModalComponent implements OnInit {
  @Input() name: string;
  @Input() title: string;
  @Input() datetime: string;
  constructor() {}

  ngOnInit() {}
}
