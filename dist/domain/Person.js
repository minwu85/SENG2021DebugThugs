"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.Person = void 0;
class Person {
    constructor(personUid, // GUID Unique ID
    username, password, email) {
        this.personUid = personUid;
        this.username = username;
        this.password = password;
        this.email = email;
    }
}
exports.Person = Person;
class Session {
    constructor(token, personUid) {
        this.token = token;
        this.personUid = personUid;
    }
}
exports.Session = Session;
