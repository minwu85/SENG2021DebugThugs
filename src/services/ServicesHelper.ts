import { Person } from "../domain/Person";
import { PersonRepository, SessionRepository } from "../repository/PersonRepository";

export class Validation {
  public sessionRepo: SessionRepository;
  public personRepo: PersonRepository;

  constructor() {
    this.sessionRepo = new SessionRepository();
    this.personRepo = new PersonRepository();
  }

  public async validateToken(
    token: string,
    personUid: string
  ) {
    const foundPersonUid = await this.sessionRepo.findPersonUidFromToken(token);
    if (!foundPersonUid) {
      throw new Error('This token does not exist');
    } else if (foundPersonUid !== personUid) {
      throw new Error('This session does not belong to this user');
    }
  }

  // finds user from email or username
  public async findUser(userInput: any): Promise <Person> {
    let user = await this.personRepo.findByUsername(userInput);
    if (!user) {
      user = await this.personRepo.findByEmail(userInput);
    }
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // validates a person's password
  public validatePassword(user: Person, password: string) {
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
  }
}
