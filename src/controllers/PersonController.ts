import { Request, Response, NextFunction } from 'express';
import { PersonService } from '../services/PersonService';

const personService = new PersonService();

// POST /api/person
export async function savePerson(req: Request, res: Response) {
  try {
    const { username, password, email } = req.body;
    const newPerson = await personService.savePerson(username, password, email);
    return res.status(201).json(newPerson);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to save person' });
  }
}

// GET /api/person/:username
export async function getPersonByUsername(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const person = await personService.getPersonByUsername(username);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    return res.json(person);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to get person' });
  }
}

// GET /api/person/email/:email
export async function getPersonByEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const person = await personService.getPersonByEmail(email);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    return res.json(person);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to get person' });
  }
}
