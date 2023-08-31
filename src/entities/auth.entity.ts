import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Books } from "./books.entity";

@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  profile: string;

  @Column()
  password: string;

  @OneToMany(() => Books, (books) => books.createdBy)
  books: Books[];
}
