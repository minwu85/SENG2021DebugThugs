"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PersonController_1 = require("../controllers/PersonController");
const router = (0, express_1.Router)();
// POST /api/person
router.post('/v1/registerUser', PersonController_1.registerUser);
router.post('/v1/loginUser', PersonController_1.loginUser);
// GET /api/person/:username
// router.get('/:username', getPersonByUsername);
// GET /api/person/email/:email
// router.get('/email/:email', getPersonByEmail);
// DELTE /api/person
router.delete('/v1/logoutUser', PersonController_1.logoutUser);
exports.default = router;
