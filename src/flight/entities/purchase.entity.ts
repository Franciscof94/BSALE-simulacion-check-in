import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BoardingPass } from './boarding_pass.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn({ name: 'purchase_id' })
  purchaseId: number;

  @Column({ name: 'purchase_date' })
  purchaseDate: number;

  @OneToMany(() => BoardingPass, boardingPass => boardingPass.purchase)
  boardingPasses: BoardingPass[];
}