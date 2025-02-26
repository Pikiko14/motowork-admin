export interface ServiceInterface {
  hour: string;
  date: string;
  hourType: string;
  client: ClientInterface;
  vehicle_dni: string;
  vehicle_type: string;
  vehicle_km: string;
  complement: string;
  level_to_schedule: string;
  _id?: string;
}

interface ClientInterface {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
}
