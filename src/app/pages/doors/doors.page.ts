import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/core/models';
import { TOOLBAR_TITLE } from './constants';

@Component({
  selector: 'app-doors',
  templateUrl: 'doors.page.html',
  styleUrls: ['doors.page.scss'],
})
export class DoorsPage implements OnInit {
  toolbarTitle = TOOLBAR_TITLE;
  vehicles: Vehicle[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.vehicles = response.vehicles;
    });
  }
}
