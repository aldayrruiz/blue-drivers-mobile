import { Component, Input, OnInit } from '@angular/core';
import { Ghost } from 'src/app/core/services';

@Component({
  selector: 'app-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.scss'],
})
export class HomeButtonComponent implements OnInit {
  @Input() button: any;
  constructor(private readonly fleetRouter: Ghost) {}
  ngOnInit() {}

  async goTo(url: string) {
    await this.fleetRouter.goTo(url);
  }
}
