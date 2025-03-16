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
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getPersonByUsername = getPersonByUsername;
exports.getPersonByEmail = getPersonByEmail;
exports.logoutUser = logoutUser;
const PersonService_1 = require("../services/PersonService");
const personService = new PersonService_1.PersonService();
// POST /api/person
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, email } = req.body;
        try {
            const result = yield personService.registerUser(username, password, email);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }
            else {
                return res.status(401).json({ error: 'Unknown error' });
            }
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userInput, password } = req.body;
        try {
            const result = yield personService.loginUser(userInput, password);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }
            else {
                return res.status(401).json({ error: 'Unknown error' });
            }
        }
    });
}
// GET /api/person/:username
function getPersonByUsername(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username } = req.params;
            const person = yield personService.getPersonByUsername(username);
            if (!person) {
                return res.status(404).json({ error: 'Person not found' });
            }
            return res.json(person);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            else {
                return res.status(500).json({ error: 'Unknown error' });
            }
        }
    });
}
// GET /api/person/email/:email
function getPersonByEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.params;
            const person = yield personService.getPersonByEmail(email);
            if (!person) {
                return res.status(404).json({ error: 'Person not found' });
            }
            return res.json(person);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            else {
                return res.status(500).json({ error: 'Unknown error' });
            }
        }
    });
}
function logoutUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header('token');
        if (!token) {
            return res.status(401).json({ error: 'Token is required' });
        }
        try {
            const result = yield personService.logoutUser(token);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            else {
                return res.status(500).json({ error: 'Unknown error' });
            }
        }
    });
}
