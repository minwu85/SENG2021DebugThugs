import { PersonRepository, SessionRepository } from '../repository/PersonRepository';
import { Person } from '../domain/Person';
import { v4 as uuidv4 } from 'uuid';

export class PersonService {
  private personRepo: PersonRepository;
  private sessionRepo: SessionRepository;

  constructor() {
    this.personRepo = new PersonRepository();
  }

  public async registerUser(username: string, password: string, email: string): Promise<string> {
    const personUid = uuidv4();
    const newPerson = new Person(personUid, username, password, email);
    
    // push to repo
    this.personRepo.save(newPerson);

    // generate new token
    const newToken = this.sessionRepo.startSession(personUid);

    return newToken;
  }

  public async getPersonByUsername(username: string): Promise<Person | null> {
    return this.personRepo.findByUsername(username);
  }

  public async getPersonByEmail(email: string): Promise<Person | null> {
    return this.personRepo.findByEmail(email);
  }
}
