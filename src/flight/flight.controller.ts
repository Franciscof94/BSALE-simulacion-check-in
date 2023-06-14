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

  @Get(':flight_id')
  async findAll(@Param()  flight_id: number ) {

    const flight = await this.flightRepository.findOne({
      where: {
        flight_id: flight_id,
      },
    });

    if (!flight) {
      return null;
    }

    console.log(flight)
    const boarding_passes = await this.boardingPassRepository.find({
      where: {
          flight_id: flight.flight_id
      },
      relations: ['passenger'],
      order: {
        seat_type_id: 'ASC',
        seat_id: 'ASC'
      },
  });

  if (boarding_passes.length === 0) {
    return null;
}

 

  return 'gola'
   
  }

 /*  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.flightService.findOne(+id);
  } */

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightService.update(+id, updateFlightDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.flightService.remove(+id);
  }
}
