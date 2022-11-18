import { Component, Input } from '@angular/core';
import { Incident } from 'src/app/core/models';

@Component({
  selector: 'app-incident-status',
  templateUrl: './incident-status.component.html',
  styleUrls: ['./incident-status.component.scss'],
})
export class IncidentStatusComponent {
  @Input() incident: Incident;
}
