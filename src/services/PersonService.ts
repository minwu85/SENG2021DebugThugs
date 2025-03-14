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
    const newPerson = new Person(personUid, username, password, email);

    // push to repo
    this.personRepo.save(newPerson);

    // generate new token
    const newToken = this.sessionRepo.startSession(personUid);

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
      user = validation.findUser(userInput);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      throw new Error (errorMessage);
    }

    // check password is correct
    try {
      validation.validatePassword(user, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      throw new Error(errorMessage);
    }

    // start a new session for this user
    const token = this.sessionRepo.startSession(user.personUid);
    return token;
  }

  /**
   * logs in a user
   * @param {string} token
  */
  public async logoutUser(token: string): Promise <any> {
    // validate token
    const validateToken = new Validation();
    const personUid = this.sessionRepo.findPersonUidFromToken(token);
    if (!personUid) {
      throw new Error('Invalid token');
    }

    try {
      validateToken.validateToken(token, personUid);
    } catch (error) {
      throw new Error('Invalid token');
    }

    this.sessionRepo.endSession(token);
    return {};
  }

  public async getPersonByUsername(username: string): Promise<Person | null> {
    return this.personRepo.findByUsername(username);
  }

  public async getPersonByEmail(email: string): Promise<Person | null> {
    return this.personRepo.findByEmail(email);
  }
}
