import { Component, Input, OnInit } from '@angular/core';
import { IncidentType } from 'src/app/core/models';

@Component({
  selector: 'app-incident-type',
  templateUrl: './incident-type.component.html',
  styleUrls: ['./incident-type.component.scss'],
})
export class IncidentTypeComponent implements OnInit {
  @Input() type: IncidentType;

  constructor() {}

  ngOnInit() {}
}
