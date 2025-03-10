import { SessionRepository } from "../repository/PersonRepository";

export class Validation {
  public sessionRepo: SessionRepository;

  constructor() {
    this.sessionRepo = new SessionRepository();
  }

  public validateToken(
    token: string,
    personUid: string
  ) {
    const foundPersonUid = this.sessionRepo.findPersonUidFromToken(token);
    if (!foundPersonUid) {
      throw new Error('This token does not exist');
    } else if (foundPersonUid !== personUid) {
      throw new Error('This session does not belong to this user');
    }
  }
}
