import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Auth } from "./auth.entity";

@Entity()
export class Books extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Auth, (auth) => auth.books)
  createdBy: Auth;
}
