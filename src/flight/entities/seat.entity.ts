import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Airplane } from './airplane.entity';
import { SeatType } from './seat_type.entity';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  seat_id: number;

  @Column()
  seat_column: string;

  @Column()
  seat_row: number;

  @Column()
  seat_type_id: number;

  @Column()
  airplane_id: number;

  @ManyToOne(() => Airplane)
  airplane: Airplane;

  @ManyToOne(() => SeatType)
  seat_type: SeatType;
}