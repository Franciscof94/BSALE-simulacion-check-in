import { Controller, Get, Param, Res, HttpStatus, Redirect } from "@nestjs/common";
import { FlightService } from "./flight.service";
@Controller("flights")
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get(":id/passengers")
  @Redirect(':flightId/passengers', 302)
  async findOne(@Param() params: { id: number }, @Res() res) {
    try {
      const { id } = params;
      const data = await this.flightService.seatsDistribution(id);

      if (data == null) {
        return res.status(HttpStatus.NOT_FOUND).send({ code: 404, data: {} });
      }

      return res.status(HttpStatus.OK).send({ code: 200, data });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ code: 400, errors: "could not connect to db" });
    }
  }
}
