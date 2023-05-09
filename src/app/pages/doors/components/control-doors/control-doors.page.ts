import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/core/models';
import { TOOLBAR_TITLE } from '../../constants';

@Component({
  selector: 'app-control-doors',
  templateUrl: './control-doors.page.html',
  styleUrls: ['./control-doors.page.scss'],
})
export class ControlDoorsPage implements OnInit {
  toolbarTitle = TOOLBAR_TITLE;
  vehicle!: Vehicle;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.resolve();
  }

  openDoorsBySMS() {
    console.log('open doors by SMS');
  }

  openDoorsByBluetooth() {
    console.log('open doors by Bluetooth');
  }

  openDoorsByGPRS() {
    console.log('open doors by GPRS');
  }

  resolve() {
    this.route.data.subscribe((response) => {
      this.vehicle = response.vehicle;
    });
  }
}
