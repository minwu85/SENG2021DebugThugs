"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonService = void 0;
const PersonRepository_1 = require("../repository/PersonRepository");
const Person_1 = require("../domain/Person");
const uuid_1 = require("uuid");
const ServicesHelper_1 = require("./ServicesHelper");
class PersonService {
    constructor() {
        this.personRepo = new PersonRepository_1.PersonRepository();
        this.sessionRepo = new PersonRepository_1.SessionRepository();
    }
    /**
     * registers a user
     * @param {string} username
     * @param {string} password
     * @param {string} email
     * @returns {string} token
    */
    registerUser(username, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const personUid = (0, uuid_1.v4)();
            const newPerson = new Person_1.Person(personUid, username, password, email);
            // push to repo
            this.personRepo.save(newPerson);
            // generate new token
            const newToken = this.sessionRepo.startSession(personUid);
            return newToken;
        });
    }
    /**
     * logs in a user
     * @param {string} userInput (username or password)
     * @param {string} password
     * @returns {string} token
    */
    loginUser(userInput, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if 'user' is username or email
            const validation = new ServicesHelper_1.Validation();
            let user;
            try {
                user = validation.findUser(userInput);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error('Unknown error');
                }
            }
            // check password is correct
            try {
                validation.validatePassword(user, password);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error('Unknown error');
                }
            }
            // start a new session for this user
            const token = this.sessionRepo.startSession(user.personUid);
            return token;
        });
    }
    /**
     * logs in a user
     * @param {string} token
    */
    logoutUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // validate token
            const validateToken = new ServicesHelper_1.Validation();
            const personUid = this.sessionRepo.findPersonUidFromToken(token);
            if (!personUid) {
                throw new Error('Invalid token');
            }
            try {
                validateToken.validateToken(token, personUid);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error('Invalid token');
                }
                else {
                    throw new Error('Unknown error');
                }
            }
            this.sessionRepo.endSession(token);
            return {};
        });
    }
    getPersonByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.personRepo.findByUsername(username);
        });
    }
    getPersonByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.personRepo.findByEmail(email);
        });
    }
}
exports.PersonService = PersonService;
