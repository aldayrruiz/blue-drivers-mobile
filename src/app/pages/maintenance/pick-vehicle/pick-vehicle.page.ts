import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/core/models';
import { TOOLBAR_TITLE } from '../constants';

@Component({
  selector: 'app-pick-vehicle',
  templateUrl: './pick-vehicle.page.html',
  styleUrls: ['./pick-vehicle.page.scss'],
})
export class PickVehiclePage implements OnInit {
  toolbarTitle = TOOLBAR_TITLE;
  vehicles: Vehicle[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.vehicles = response.vehicles;
    });
  }
}
