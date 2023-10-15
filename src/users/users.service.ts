import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "changeme"
    },
    {
      id: 2,
      name: "Alice Caeiro",
      email: "alice@example.com",
      password: "secret"
    }
  ];

  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findOnByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
