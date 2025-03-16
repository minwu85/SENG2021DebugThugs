"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const PersonRepository_1 = require("../repository/PersonRepository");
class Validation {
    constructor() {
        this.sessionRepo = new PersonRepository_1.SessionRepository();
        this.personRepo = new PersonRepository_1.PersonRepository();
    }
    validateToken(token, personUid) {
        const foundPersonUid = this.sessionRepo.findPersonUidFromToken(token);
        if (!foundPersonUid) {
            throw new Error('This token does not exist');
        }
        else if (foundPersonUid !== personUid) {
            throw new Error('This session does not belong to this user');
        }
    }
    // finds user from email or username
    findUser(userInput) {
        let user = this.personRepo.findByUsername(userInput);
        if (!user) {
            user = this.personRepo.findByEmail(userInput);
        }
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    // validates a person's password
    validatePassword(user, password) {
        if (user.password !== password) {
            throw new Error('Invalid password');
        }
    }
}
exports.Validation = Validation;
