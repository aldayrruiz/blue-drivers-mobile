/* eslint-disable @typescript-eslint/naming-convention */
import { IncidentType } from '..';

export interface CreateIncident {
  id?: string;
  date_stored?: string;
  description: string;
  type: IncidentType;
  owner?: string;
  reservation: string;
  photo?: string;
  self_responsible: boolean;
}
