import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
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
  seat_type: SeatType;
}