import { Person, Session } from '../domain/Person';
import { v4 as uuidv4 } from 'uuid';

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

export class SessionRepository {
  private static sessions:  Session [] = [];

  public findPersonUidFromToken(token: string): string | null {
    const found = SessionRepository.sessions.find(i => i.token === token);
    return found?.personUid || null;
  }

  public startSession(personUid: string): string {
    const token = uuidv4();
    const session = new Session (token, personUid);

    SessionRepository.sessions.push(session);

    return token;
  }
}