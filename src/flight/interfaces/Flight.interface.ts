export interface IFlightData {
  flightId: number;
  takeoffDateTime: number;
  takeoffAirport: string;
  landingDateTime: number;
  landingAirport: string;
  airplaneId: number;
  passengers: IPassenger[];
}

export interface IPassenger {
  passengerId: number;
  dni: number;
  name: string;
  age: number;
  country: string;
  boardingPassId: number;
  purchaseId: number;
  seatTypeId: number;
  seatId: number | null;
}

