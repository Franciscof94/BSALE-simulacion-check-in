import { Injectable } from "@nestjs/common";
import { CreateFlightDto } from "./dto/create-flight.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BoardingPass } from "./entities/boarding_pass.entity";
import { Flight } from "./entities/flight.entity";
import { Seat } from "./entities/seat.entity";
import { IPassenger, IFlightData } from "./interfaces";

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(BoardingPass)
    private readonly boardingPassRepository: Repository<BoardingPass>,
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  // Crea un vuelo
  create(createFlightDto: CreateFlightDto) {
    return "";
  }

  // Obtiene los datos de un vuelo en formato CamelCase según su ID
  async flightData(flight_id: number): Promise<IFlightData | null> {
    const flight = await this.flightRepository.findOne({
      where: {
        flightId: flight_id,
      },
    });

    if (!flight) {
      return null;
    }

    const boarding_passes = await this.boardingPassRepository.find({
      where: {
        flightId: flight.flightId,
      },
      relations: ["passenger"],
      order: {
        seatTypeId: "ASC",
        seatId: "ASC",
      },
    });

    if (boarding_passes.length === 0) {
      return null;
    }

    const data: IFlightData = {
      flightId: flight.flightId,
      takeoffDateTime: flight.takeoffDateTime,
      takeoffAirport: flight.takeoffAirport,
      landingDateTime: flight.landingDateTime,
      landingAirport: flight.landingAirport,
      airplaneId: flight.airplaneId,
      passengers: boarding_passes.map((boardingPass) => ({
        passengerId: boardingPass.passenger.passengerId,
        dni: parseInt(boardingPass.passenger.dni),
        name: boardingPass.passenger.name,
        age: boardingPass.passenger.age,
        country: boardingPass.passenger.country,
        boardingPassId: boardingPass.boardingPassId,
        purchaseId: boardingPass.purchaseId,
        seatTypeId: boardingPass.seatTypeId,
        seatId: boardingPass.seatId,
      })),
    };

    return data;
  }

  // Obtiene una lista de todas las sillas ordenadas por ID
  async seatsList(): Promise<Seat[]> {
    const seatsList = await this.seatRepository.find({
      order: {
        seatId: "ASC",
      },
    });
    return seatsList;
  }

  // Obtiene los IDs de las sillas ocupadas según la lista de pasajeros
  async occupiedSeatsId(passengersList: IPassenger[]): Promise<number[]> {
    const occupiedSeatsId: number[] = passengersList
      .filter((passenger) => passenger.seatId !== null)
      .map((passenger) => passenger.seatId);

    return occupiedSeatsId;
  }

  // Encuentra los IDs de los tipos de asientos disponibles para un tipo de asiento específico en un vuelo
  async findAvailableSeatTypeIds(
    seatTypeId: number,
    flight_data: IFlightData,
  ): Promise<number[]> {
    const seats = await this.seatRepository.find({
      where: {
        airplaneId: flight_data.airplaneId,
        seatTypeId: seatTypeId,
      },
    });

    if (!seats) {
      return null;
    }

    const occupiedSeatsId = await this.occupiedSeatsId(flight_data.passengers);
    const seatTypeIdList = seats.map((seat) => seat.seatId);
    const seatAvailableTypeIdList = seatTypeIdList.filter(
      (seatId) => !occupiedSeatsId.includes(seatId),
    );
    return seatAvailableTypeIdList;
  }

  // Encuentra una silla específica según su ID en una lista de sillas
  async findSeat(seatId: number, seats: Seat[]): Promise<Seat> {
    return seats.find((seat) => seat.seatId === seatId);
  }

  // Encuentra una silla adyacente en una lista de sillas
  async findAdjacentSeat(
    seats: Seat[],
    columnOffset: number,
    rowOffset: number,
  ): Promise<number> {
    const adjacentSeat = seats.find(
      (seat) =>
        seat.seatColumn ===
          String.fromCharCode(seat.seatColumn.charCodeAt(0) + columnOffset) &&
        seat.seatRow === seat.seatRow + rowOffset &&
        seat.airplaneId === seat.airplaneId,
    );
    return adjacentSeat ? adjacentSeat.seatId : null;
  }

  // Distribuye los asientos para un vuelo específico
  async seatsDistribution(flight_id: number) {
    let data: IFlightData = await this.flightData(flight_id);

    if (!data) {
      return null;
    }

    let seatsData = await this.seatsList();

    let availableSeatsIds = {
      1: await this.findAvailableSeatTypeIds(1, data),
      2: await this.findAvailableSeatTypeIds(2, data),
      3: await this.findAvailableSeatTypeIds(3, data),
    };

    let passengers: IPassenger[] = data["passengers"];

    let listOfEmptySeatIds: number[];

    for (const passenger of passengers) {
      // Si el pasajero es menor de 18 años y no tiene asignada una silla
      if (passenger.age < 18 && passenger.seatId === null) {
        const companions: IPassenger[] = passengers.filter(
          (companion) =>
            companion.purchaseId === passenger.purchaseId &&
            companion.seatId === null &&
            companion.passengerId !== passenger.passengerId &&
            companion.age >= 18,
        );

        listOfEmptySeatIds = availableSeatsIds[passenger.seatTypeId];

        // Asigna asientos a los acompañantes
        for (const companion of companions) {
          const seat_id = listOfEmptySeatIds.shift();
          if (seat_id != null) {
            [passenger.seatId, companion.seatId] = [seat_id, seat_id];
          }
        }
        availableSeatsIds[passenger.seatTypeId] = listOfEmptySeatIds;
      }
    }

    for (const passenger of passengers) {
      listOfEmptySeatIds = availableSeatsIds[passenger.seatTypeId];

      let assigned: boolean = false;

      if (passenger.age >= 18 && passenger.seatId == null) {
        const companions = passengers.filter(
          (companion) =>
            companion.purchaseId === passenger.purchaseId &&
            companion.seatId === null &&
            companion.passengerId !== passenger.passengerId,
        );

        if (companions) {
          for (const companion of companions) {
            if (passengers[passengers.indexOf(companion)]["seatId"] == null) {
              const seatPositions = {
                left: await this.findAdjacentSeat(seatsData, -1, 0),
                right: await this.findAdjacentSeat(seatsData, 1, 0),
                front: await this.findAdjacentSeat(seatsData, 0, 1),
                back: await this.findAdjacentSeat(seatsData, 0, -1),
                northeast: await this.findAdjacentSeat(seatsData, 1, 1),
                southeast: await this.findAdjacentSeat(seatsData, 1, -1),
                northwest: await this.findAdjacentSeat(seatsData, -1, 1),
                southwest: await this.findAdjacentSeat(seatsData, -1, -1),
              };

              // Función para asignar un asiento a un pasajero
              const assignSeat = (passenger, seatId) => {
                if (passenger.seatId === null) {
                  passenger.seatId = seatId;
                  listOfEmptySeatIds = listOfEmptySeatIds.filter(
                    (id) => id !== seatId,
                  );
                }
              };

              // Encuentra el ID de un asiento disponible en las posiciones adyacentes
              const availableSeatId = Object.values(seatPositions).find(
                (seatId) =>
                  seatId != null && listOfEmptySeatIds.includes(seatId),
              );

              if (availableSeatId) {
                assignSeat(passenger, availableSeatId);
                assignSeat(
                  passengers[passengers.indexOf(companion)],
                  availableSeatId,
                );
                listOfEmptySeatIds.splice(
                  listOfEmptySeatIds.indexOf(availableSeatId),
                  1,
                );
                assigned = true;
              }
            }
            availableSeatsIds[passenger.seatTypeId] = listOfEmptySeatIds;
          }
        }
      }
    }

    // Asigna los asientos restantes a los pasajeros
    for (const passenger of passengers) {
      listOfEmptySeatIds = availableSeatsIds[passenger.seatTypeId];
      if (passenger.seatId == null) {
        passenger.seatId = listOfEmptySeatIds[0];
        listOfEmptySeatIds.splice(0, 1);
        availableSeatsIds[passenger.seatTypeId] = listOfEmptySeatIds;
      }
    }

    data.passengers = passengers;

    return data;
  }
}
