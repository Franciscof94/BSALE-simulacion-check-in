import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airplane } from './entities/airplane.entity';
import { BoardingPass } from './entities/boarding_pass.entity';
import { Flight } from './entities/flight.entity';
import { Passenger } from './entities/passenger.entity';
import { Purchase } from './entities/purchase.entity';
import { SeatType } from './entities/seat_type.entity';
import { Seat } from './entities/seat.entity';

@Module({
  controllers: [FlightController],
  providers: [FlightService],
  imports: [
    TypeOrmModule.forFeature(
      [
        Airplane,
        BoardingPass,
        Flight,
        Passenger,
        Purchase,
        SeatType,
        Seat
      ]
    )
  ]
})
export class FlightModule {}
