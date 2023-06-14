import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Airplane } from './airplane.entity';
import { SeatType } from './seat_type.entity';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn({ name: 'seat_id' })
  seatId: number;

  @Column({ name: 'seat_column' })
  seatColumn: string;

  @Column({ name: 'seat_row' })
  seatRow: number;

  @Column({ name: 'seat_type_id' })
  seatTypeId: number;

  @Column({ name: 'airplane_id' })
  airplaneId: number;

  @ManyToOne(() => Airplane)
  @JoinColumn({ name: 'airplane_id' })
  airplane: Airplane;

  @ManyToOne(() => SeatType)
  @JoinColumn({ name: 'seat_type_id' })
  seat_type: SeatType;
}






