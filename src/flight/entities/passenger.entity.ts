import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BoardingPass } from './boarding_pass.entity';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn()
  passenger_id: number;

  @Column()
  dni: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  country: string;

  @OneToMany(() => BoardingPass, boardingPass => boardingPass.passenger)
  boardingPasses: BoardingPass[];
}