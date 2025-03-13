import { Router } from 'express';
import {
  registerUser,
  getPersonByUsername,
  getPersonByEmail
} from '../controllers/PersonController';

const router = Router();

// POST /api/person
router.post('/v1/registerUser', registerUser);

// GET /api/person/:username
// router.get('/:username', getPersonByUsername);

// GET /api/person/email/:email
// router.get('/email/:email', getPersonByEmail);

export default router;
