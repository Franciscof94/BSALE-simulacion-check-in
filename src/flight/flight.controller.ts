import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { FlightService } from "./flight.service";
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

@Controller("flight")
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
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

  @Post()
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.create(createFlightDto);
  }

  @Get(":flight_id")
  async flightData(@Param() flight_id: number) {
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
    console.log(flight)


   /*  const data: FlightData = {
      flightId: flight.flight_id,
      takeoffDateTime: flight.takeoff_date_time,
      takeoffAirport: flight.takeoff_airport,
      landingDateTime: flight.landing_date_time,
      landingAirport: flight.landing_airport,
      airplaneId: flight.airplane_id,
      passengers: boarding_passes.map((boardingPass) => ({
        passengerId: boardingPass.passenger.passenger_id,
        dni: parseInt(boardingPass.passenger.dni),
        name: boardingPass.passenger.name,
        age: boardingPass.passenger.age,
        country: boardingPass.passenger.country,
        boardingPassId: boardingPass.boarding_pass_id,
        purchaseId: boardingPass.purchase_id,
        seatTypeId: boardingPass.seat_type_id,
        seatId: boardingPass.seat_id,
      })),
    }; */

    return "gola";
  }
}
