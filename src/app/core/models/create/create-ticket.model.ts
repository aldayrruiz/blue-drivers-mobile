/* eslint-disable @typescript-eslint/naming-convention */
export interface CreateTicket {
  id?: string;
  title: string;
  reservation: string;
  description: string;
  date_stored?: string;
}
