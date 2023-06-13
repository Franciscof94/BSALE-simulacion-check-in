import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Flight } from './flight.entity';
import { Passenger } from './passenger.entity';
import { Purchase } from './purchase.entity';
import { Seat } from './seat.entity';
import { SeatType } from './seat_type.entity';

@Entity()
export class BoardingPass {
  @PrimaryGeneratedColumn()
  boarding_pass_id: number;

  @Column()
  purchase_id: number;

  @Column()
  passenger_id: number;

  @Column()
  seat_type_id: number;

  @Column({ nullable: true })
  seat_id: number;

  @Column()
  flight_id: number;

  @ManyToOne(() => Flight)
  flight: Flight;

  @ManyToOne(() => Passenger)
  passenger: Passenger;

  @ManyToOne(() => Purchase)
  purchase: Purchase;

  @ManyToOne(() => Seat)
  seat: Seat;

  @ManyToOne(() => SeatType)
  seat_type: SeatType;
}