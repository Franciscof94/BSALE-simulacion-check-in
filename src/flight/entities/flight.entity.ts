import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Airplane } from './airplane.entity';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  flight_id: number;

  @Column()
  takeoff_date_time: number;

  @Column()
  takeoff_airport: string;

  @Column()
  landing_date_time: number;

  @Column()
  landing_airport: string;

  @ManyToOne(() => Airplane)
  @JoinColumn({ name: 'airplane_id' })
  airplane: Airplane;
}