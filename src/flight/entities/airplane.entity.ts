import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Flight } from './flight.entity';

@Entity()
export class Airplane {
  @PrimaryGeneratedColumn({ name: 'airplane_id' })
  airplaneId: number;

  @Column()
  name: string;

  @OneToMany(() => Flight, flight => flight.airplaneId) // Cambia 'flight.airplane' por 'flight.airplaneId'
  flights: Flight[];
}