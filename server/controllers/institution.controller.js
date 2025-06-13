// controllers/institutionController.js
import * as InstitutionModel from '../models/institutionModel.js';
import db from '../config/db.js';
import { logErrorToFile } from '../utils/logger.js';

export async function getAllInstitutions(req, res) {
  try {
    const institutions = await InstitutionModel.getAllInstitutions();
    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ message: 'Server error' });
    logErrorToFile(`GetAllInstitutions error for ${req.body.email}: ${err.message}`);
  }
}

export async function getInstitutionById(req, res) {
  try {
    const institution = await InstitutionModel.getInstitutionById(req.params.id);
    if (!institution) return res.status(404).json({ message: 'Institution not found' });
    res.json(institution);
  } catch (error) {
    console.error('Error fetching institution by ID:', error);
    res.status(500).json({ message: 'Server error' });
    logErrorToFile(`getInstitutionByID error for ${req.body.email}: ${err.message}`);
  }
}

export async function createInstitution(req, res) {
  try {
   
    const user_id = req.user.userId;
    const {name, email, description, address } = req.body;
    const result = await InstitutionModel.createInstitution({user_id ,name, email, description, address});
    res.status(201).json({ message: 'Institution created', id: result.id, name: name, email: email, description: description, address: address });
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
    logErrorToFile(`createInstitution error for ${req.body.email}: ${err.message}`);
  }
}

export async function deleteInstitution(req, res) {
  try {
    const institutionId = req.params.id;
    const result = await InstitutionModel.deleteInstitution(institutionId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    
    res.json({ message: 'Institution deleted successfully', id: result.id });
  } catch (error) {
    console.error('Error deleting institution:', error);
    res.status(500).json({ message: 'Server error' });
    logErrorToFile(`deleteInstitution error for ${req.body.email}: ${err.message}`);
  }
}

export const updateInstitution = async (req, res) => {
  const userId = req.user.userId;
  const { name, description, address, email } = req.body;
  try {
    const [institution] = await db.query('SELECT * FROM institutions WHERE user_id = ?', [userId]);
    if (institution.length === 0) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    await db.query(
      `UPDATE institutions SET name = ?, description = ?, address = ?, email = ? WHERE user_id = ?`,
      [name, description, address, email, userId]
    );
    res.status(200).json({ message: 'Institution details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update institution details' });
    logErrorToFile(`updateInstitution error for ${req.body.email}: ${err.message}`);
  }
};
