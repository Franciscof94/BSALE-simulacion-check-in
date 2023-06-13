import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Seat } from './seat.entity';

@Entity()
export class SeatType {
  @PrimaryGeneratedColumn()
  seat_type_id: number;

  @Column()
  name: string;

  @OneToMany(() => Seat, seat => seat.seat_type)
  seats: Seat[];
}