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

  create(createFlightDto: CreateFlightDto) {
    return "";
  }

  async flightData(flight_id: number): Promise<IFlightData | null> {
    // Retorna los datos de un vuelo en formato CamelCase, dado su ID.
    // @param flight_id El ID del vuelo.
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

  async seatsList(): Promise<Seat[]> {
    // Retorna una lista de todas las sillas ordenadas por id
    const seatsList = await this.seatRepository.find({
      order: {
        seatId: "ASC",
      },
    });
    return seatsList;
  }

  async occupiedSeatsId(passengersList: IPassenger[]): Promise<number[]> {
    const occupiedSeatsId: number[] = passengersList
      .filter((passenger) => passenger.seatId !== null)
      .map((passenger) => passenger.seatId);

    return occupiedSeatsId;
  }

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

  async findSeat(seatId: number, seats: Seat[]): Promise<Seat> {
    return seats.find((seat) => seat.seatId === seatId);
  }

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

      if (passenger.age < 18 && passenger.seatId === null) {
        
        const companions: IPassenger[] = passengers.filter(
          (companion) =>
            companion.purchaseId === passenger.purchaseId &&
            companion.seatId === null &&
            companion.passengerId !== passenger.passengerId &&
            companion.age >= 18,
        );




        const seatTypeId = passenger.seatTypeId;
        listOfEmptySeatIds = availableSeatsIds[seatTypeId];

        for (const companion of companions) {
          const seat_id = listOfEmptySeatIds.shift();


          if (seat_id != null) {
            [passenger.seatId, companion.seatId] = [seat_id, seat_id];
          }
        }

        availableSeatsIds[seatTypeId] = listOfEmptySeatIds;
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
              for (const seat_id of listOfEmptySeatIds) {

                const seatPositions = {
                  left: this.findAdjacentSeat(seatsData, -1, 0),
                  right: this.findAdjacentSeat(seatsData, 1, 0),
                  front: this.findAdjacentSeat(seatsData, 0, 1),
                  back: this.findAdjacentSeat(seatsData, 0, -1),
                  northeast: this.findAdjacentSeat(seatsData, 1, 1),
                  southeast: this.findAdjacentSeat(seatsData, 1, -1),
                  northwest: this.findAdjacentSeat(seatsData, -1, 1),
                  southwest: this.findAdjacentSeat(seatsData, -1, -1),
                };

                function assignSeat(passenger, seatId) {
                  if (passenger.seatId === null) {
                    passenger.seatId = seatId;
                    listOfEmptySeatIds.splice(
                      listOfEmptySeatIds.indexOf(seatId),
                      1,
                    );
                  }
                }

                for (const position in seatPositions) {
                  const seatId = seatPositions[position];
                  if (
                    seatId != null &&
                    listOfEmptySeatIds.includes(seatId)
                  ) {
                    assignSeat(passenger, seat_id);
                    assignSeat(
                      passengers[passengers.indexOf(companion)],
                      seatId,
                    );
                    listOfEmptySeatIds.splice(
                      listOfEmptySeatIds.indexOf(seatId),
                      1,
                    );
                    assigned = true;
                    break;
                  }
                }
              }
            }
            availableSeatsIds[passenger.seatTypeId] =
              listOfEmptySeatIds;
          }
        }
      }
    }

    for (const passenger of passengers) {
      listOfEmptySeatIds = availableSeatsIds[passenger.seatTypeId];
      if (passenger.seatId == null) {
        passenger.seatId = listOfEmptySeatIds[0];
        listOfEmptySeatIds.splice(0, 1);
        availableSeatsIds[passenger.seatTypeId] = listOfEmptySeatIds;
      }
    }

    data["passengers"] = passengers;

    return data;
  }
}
