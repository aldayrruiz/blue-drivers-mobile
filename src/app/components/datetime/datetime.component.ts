import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
})
export class DatetimeComponent implements OnInit {
  @Input() title: string;
  @Input() datetime: string;
  @Input() isRecurrent = false;
  @Input() disabled = false;

  // id is useful when you create many DatetimeComponents, so their functionality does not overlap
  id = String(Math.floor(Math.random() * 500) + 1);

  constructor() {}

  ngOnInit() {}

  getDateSerialized() {
    return new Date(this.datetime).toJSON();
  }
}
