import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from "@nestjs/common";
import { FlightService } from "./flight.service";
import { CreateFlightDto } from "./dto/create-flight.dto";

@Controller("flights")
export class FlightController {
  constructor(private readonly flightService: FlightService) {}


  @Get(":id/passengers")
  async findOne(@Param() params: { id: number }) {
    const { id } = params;
    return this.flightService.seatsDistribution(id);
  }
}
