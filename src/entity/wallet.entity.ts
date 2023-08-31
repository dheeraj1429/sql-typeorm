import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float", { precision: 6, scale: 2 })
  balance: number;

  @Column()
  currency: string;
}
