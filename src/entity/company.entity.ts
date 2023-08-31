import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  place: string;

  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.company, { cascade: true })
  product: Product[];
}
