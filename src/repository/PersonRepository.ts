import { Person } from '../domain/Person';

export class PersonRepository {
  private static persons: Person[] = [];

  public save(person: Person): Person {
    PersonRepository.persons.push(person);
    return person;
  }

  public findByUsername(username: string): Person | null {
    const found = PersonRepository.persons.find(p => p.username === username);
    return found || null;
  }

  public findByEmail(email: string): Person | null {
    const found = PersonRepository.persons.find(p => p.email === email);
    return found || null;
  }
}
