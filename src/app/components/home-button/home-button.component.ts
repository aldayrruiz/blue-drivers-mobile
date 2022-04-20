import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.scss'],
})
export class HomeButtonComponent implements OnInit {
  @Input() title: string;
  @Input() imageHref: string;

  constructor() {}

  ngOnInit() {}
}
