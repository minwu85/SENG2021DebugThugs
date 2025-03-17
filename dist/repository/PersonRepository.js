"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = exports.PersonRepository = void 0;
const Person_1 = require("../domain/Person");
const uuid_1 = require("uuid");
class PersonRepository {
    save(person) {
        PersonRepository.persons.push(person);
        return person;
    }
    findByUsername(username) {
        const found = PersonRepository.persons.find(p => p.username === username);
        return found || null;
    }
    findByEmail(email) {
        const found = PersonRepository.persons.find(p => p.email === email);
        return found || null;
    }
}
exports.PersonRepository = PersonRepository;
PersonRepository.persons = [];
class SessionRepository {
    findPersonUidFromToken(token) {
        const found = SessionRepository.sessions.find(i => i.token === token);
        return (found === null || found === void 0 ? void 0 : found.personUid) || null;
    }
    startSession(personUid) {
        const token = (0, uuid_1.v4)();
        const session = new Person_1.Session(token, personUid);
        SessionRepository.sessions.push(session);
        return token;
    }
    endSession(token) {
        SessionRepository.sessions = SessionRepository.sessions.filter(session => session.token !== token);
    }
}
exports.SessionRepository = SessionRepository;
SessionRepository.sessions = [];
