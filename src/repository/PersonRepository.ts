import { Person, Session } from '../domain/Person';
import { pool } from '../database/DatabaseConnection';
import { v4 as uuidv4 } from 'uuid';
import { emailFind, personFromToken, savePerson, usernameFind } from '../database/databaseHelpers';

export class PersonRepository {
  public async save(person: Person): Promise<Person> {
    await savePerson(person);
    return person;
  }

  public async findByUsername(username: string): Promise<Person | null> {
    const person = await usernameFind(username);
    return person;
  }

  public async findByEmail(email: string): Promise<Person | null> {
    const person = emailFind(email);
    return person;
  }
}

export class SessionRepository {
  public async findPersonUidFromToken(token: string): Promise<string | null> {
    const person = await personFromToken(token);
    return person;
  }

  public async startSession(personUid: string): Promise<string> {
    const token = uuidv4();

    const sql = `
      INSERT INTO sessions (token, personUid)
      VALUES (?, ?)
    `;
    await pool.query(sql, [token, personUid]);

    return token;
  }

  public async endSession(token: string): Promise<void> {
    await pool.query(`
      DELETE FROM sessions
      WHERE token = ?
    `, [token]);
  }
}
