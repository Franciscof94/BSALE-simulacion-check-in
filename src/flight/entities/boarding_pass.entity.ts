import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Flight } from './flight.entity';
import { Passenger } from './passenger.entity';
import { Purchase } from './purchase.entity';
import { Seat } from './seat.entity';
import { SeatType } from './seat_type.entity';

@Entity()
export class BoardingPass {
  @PrimaryGeneratedColumn({ name: 'boarding_pass_id' })
  boardingPassId: number;

  @Column({ name: 'purchase_id' })
  purchaseId: number;

  @Column({ name: 'passenger_id' })
  passengerId: number;

  @Column({ name: 'seat_type_id' })
  seatTypeId: number;

  @Column({ name: 'seat_id', nullable: true })
  seatId: number;

  @Column({ name: 'flight_id' })
  flightId: number;

  @ManyToOne(() => Flight)
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger: Passenger;

  @ManyToOne(() => Purchase)
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase;

  @ManyToOne(() => Seat)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @ManyToOne(() => SeatType)
  @JoinColumn({ name: 'seat_type_id' })
  seatType: SeatType;
}