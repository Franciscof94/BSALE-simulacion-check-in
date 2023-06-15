import { Injectable } from "@nestjs/common";
import { CreateFlightDto } from "./dto/create-flight.dto";
import { UpdateFlightDto } from "./dto/update-flight.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BoardingPass } from "./entities/boarding_pass.entity";
import { Flight } from "./entities/flight.entity";
import { Airplane } from "./entities/airplane.entity";
import { Passenger } from "./entities/passenger.entity";
import { Purchase } from "./entities/purchase.entity";
import { SeatType } from "./entities/seat_type.entity";
import { Seat } from "./entities/seat.entity";
import { IFlightData, IPassenger } from "./interfaces";

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(BoardingPass)
    private readonly boardingPassRepository: Repository<BoardingPass>,
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    @InjectRepository(Airplane)
    private readonly airlineRepository: Repository<Airplane>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(SeatType)
    private readonly seatTypeRepository: Repository<SeatType>,
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
    seat_type_id: number,
    flight_data: IFlightData,
  ): Promise<number[]> {
    const seats = await this.seatRepository.find({
      where: {
        airplaneId: flight_data.airplaneId,
        seatTypeId: seat_type_id,
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

  async seatsDistribution(flight_id: number) {
    let data: IFlightData = await this.flightData(flight_id);
    if (!data) {
      return null;
    }

    let seatsData = await this.seatsList();

    let firstClass = await this.findAvailableSeatTypeIds(1, data);

    let premiumEconomicClass = await this.findAvailableSeatTypeIds(2, data);

    let economicClass = await this.findAvailableSeatTypeIds(3, data);
  }
}
