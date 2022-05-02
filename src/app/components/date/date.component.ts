import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  @Input() title: string;
  @Input() date: string;
  // id is useful when you create many DatetimeComponents, so their functionality does not overlap
  id = String(Math.floor(Math.random() * 500) + 1);

  constructor() {}

  ngOnInit() {}
}
