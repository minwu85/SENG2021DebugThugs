export class Person {
  constructor(
    public personUid: string,  // GUID Unique ID
    public username: string,
    public password: string,
    public email: string
  ) {}
}

export class Session {
  constructor(
    public token: string,
    public personUid: string
  ) {}
}