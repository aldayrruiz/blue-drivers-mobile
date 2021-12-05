import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident } from 'src/app/core/models';

@Component({
  selector: 'app-my-incidents',
  templateUrl: './my-incidents.page.html',
  styleUrls: ['./my-incidents.page.scss'],
})
export class MyIncidentsPage implements OnInit {
  incidents: Incident[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.incidents = response.myIncidents;
    });
  }
}
