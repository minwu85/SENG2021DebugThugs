import { PersonRepository, SessionRepository } from '../repository/PersonRepository';
import { Person } from '../domain/Person';
import { v4 as uuidv4 } from 'uuid';
import { Validation } from './ServicesHelper';

export class PersonService {
  private personRepo: PersonRepository;
  private sessionRepo: SessionRepository;

  constructor() {
    this.personRepo = new PersonRepository();
    this.sessionRepo = new SessionRepository();
  }

  // register a user
  public async registerUser(username: string, password: string, email: string): Promise<string> {
    const personUid = uuidv4();
    const newPerson = new Person(personUid, username, password, email);

    // push to repo
    this.personRepo.save(newPerson);

    // generate new token
    const newToken = this.sessionRepo.startSession(personUid);

    return newToken;
  }

  // log in a user
  public async loginUser(userInput: string, password: string): Promise <string> {
    // check if 'user' is username or email
    const validation = new Validation();
    let user: Person;

    try {
      user = validation.findUser(userInput);
    } catch (error) {
      throw new Error (error.message);
    }

    // check password is correct
    try {
      validation.validatePassword(user, password);
    } catch (error) {
      throw new Error(error.message);
    }

    // start a new session for this user
    const token = this.sessionRepo.startSession(user.personUid);
    return token;
  }

  public async getPersonByUsername(username: string): Promise<Person | null> {
    return this.personRepo.findByUsername(username);
  }

  public async getPersonByEmail(email: string): Promise<Person | null> {
    return this.personRepo.findByEmail(email);
  }
}
