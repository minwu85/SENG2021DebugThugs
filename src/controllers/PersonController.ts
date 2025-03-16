import { Request, Response } from 'express';
import { PersonService } from '../services/PersonService';

const personService = new PersonService();

// POST /api/person
export async function registerUser(req: Request, res: Response): Promise <any> {
  const { username, password, email } = req.body;
  try {
    const result = await personService.registerUser(username, password, email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

export async function loginUser(req: Request, res: Response): Promise <any> {
  const { userInput, password } = req.body;

  try {
    const result = await personService.loginUser(userInput, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
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

export async function logoutUser(req: Request, res: Response): Promise <any> {
  const token = req.header('token') as string;

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const result = await personService.logoutUser(token);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}