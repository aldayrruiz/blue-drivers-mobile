import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/core/models';
import { TOOLBAR_TITLE } from '../constants';

@Component({
  selector: 'app-vehicles',
  templateUrl: 'vehicles.page.html',
  styleUrls: ['vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {
  toolbarTitle = TOOLBAR_TITLE;
  vehicles: Vehicle[] = [];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.vehicles = response.vehicles;
    });
  }
}
