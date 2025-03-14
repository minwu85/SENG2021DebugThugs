import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getPersonByUsername,
  getPersonByEmail,
  logoutUser
} from '../controllers/PersonController';

const router = Router();

// POST /api/person
router.post('/v1/registerUser', registerUser);

router.post('/v1/loginUser', loginUser);

// GET /api/person/:username
// router.get('/:username', getPersonByUsername);

// GET /api/person/email/:email
// router.get('/email/:email', getPersonByEmail);

// DELTE /api/person
router.delete('/v1/logoutUser', logoutUser);

export default router;
