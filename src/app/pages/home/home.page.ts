import { Component, OnInit } from '@angular/core';
import { homeButtons } from './home-buttons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  toolbarTitle = 'Home';
  buttons = homeButtons;

  ngOnInit() {}
}
