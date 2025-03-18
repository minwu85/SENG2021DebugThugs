import bcrypt from 'bcrypt';
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

  /**
   * registers a user
   * @param {string} username
   * @param {string} password
   * @param {string} email
   * @returns {string} token
  */
  public async registerUser(username: string, password: string, email: string): Promise<string> {
    const personUid = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPerson = new Person(personUid, username, hashedPassword, email);

    // push to repo
    await this.personRepo.save(newPerson);

    // generate new token
    const newToken = await this.sessionRepo.startSession(personUid);

    return newToken;
  }

  /**
   * logs in a user
   * @param {string} userInput (username or password)
   * @param {string} password
   * @returns {string} token
  */
  public async loginUser(userInput: string, password: string): Promise <string> {
    // check if 'user' is username or email
    const validation = new Validation();
    let user: Person;

    try {
      user = await validation.findUser(userInput);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Unknown error');
      }
    }

    // check password is correct
    try {
      await validation.validatePassword(user, password);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Unknown error');
      }
    }

    // start a new session for this user
    const token = await this.sessionRepo.startSession(user.personUid);
    return token;
  }

  /**
   * logs in a user
   * @param {string} token
  */
  public async logoutUser(token: string): Promise <any> {
    // validate token
    const validateToken = new Validation();
    const personUid = await this.sessionRepo.findPersonUidFromToken(token);
    if (!personUid) {
      throw new Error('Invalid token');
    }

    try {
      await validateToken.validateToken(token, personUid);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Unknown error');
      }
    }

    await this.sessionRepo.endSession(token);
    return {};
  }
  
  /**
   * Updates user password
   */
  public async updatePassword(personUid: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.personRepo.findByUsername(personUid);
    if (!user) throw new Error('User not found');

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) throw new Error('Incorrect old password');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.personRepo.updatePassword(personUid, hashedNewPassword);
  }

  public async getPersonByUsername(username: string): Promise<Person | null> {
    return this.personRepo.findByUsername(username);
  }

  public async getPersonByEmail(email: string): Promise<Person | null> {
    return this.personRepo.findByEmail(email);
  }
}
