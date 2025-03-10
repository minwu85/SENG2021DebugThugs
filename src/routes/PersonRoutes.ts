import { Router } from 'express';
import {
  savePerson,
  getPersonByUsername,
  getPersonByEmail
} from '../controllers/PersonController';

const router = Router();

// POST /api/person
// router.post('/', savePerson);

// GET /api/person/:username
// router.get('/:username', getPersonByUsername);

// GET /api/person/email/:email
// router.get('/email/:email', getPersonByEmail);

export default router;
