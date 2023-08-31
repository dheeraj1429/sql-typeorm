import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Company } from "./company.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Company)
  company: Company;
}
