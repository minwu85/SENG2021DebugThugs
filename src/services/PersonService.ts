import { PersonRepository } from '../repository/PersonRepository';
import { Person } from '../domain/Person';
import { v4 as uuidv4 } from 'uuid';

export class PersonService {
  private personRepo: PersonRepository;

  constructor() {
    this.personRepo = new PersonRepository();
  }

  public async savePerson(username: string, password: string, email: string): Promise<Person> {
    // Could do validations, hashing, etc. here
    const personUid = uuidv4();
    const newPerson = new Person(personUid, username, password, email);
    return this.personRepo.save(newPerson);
  }

  public async getPersonByUsername(username: string): Promise<Person | null> {
    return this.personRepo.findByUsername(username);
  }

  public async getPersonByEmail(email: string): Promise<Person | null> {
    return this.personRepo.findByEmail(email);
  }
}
