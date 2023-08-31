import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Currency } from "./currency.entity";

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float", { precision: 6, scale: 2 })
  balance: number;

  @OneToMany(() => Currency, (currency) => currency.wallet)
  currencies: Currency[];
}
