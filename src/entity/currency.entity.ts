import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import { Wallet } from "./wallet.entity";

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.currencies)
  wallet: Wallet;
}
