// controllers/institutionController.js
import * as InstitutionModel from '../models/institutionModel.js';
import db from '../config/db.js';

export async function getAllInstitutions(req, res) {
  try {
    const institutions = await InstitutionModel.getAllInstitutions();
    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ message: 'Server error' });
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
  }
}

export async function createInstitution(req, res) {
  try {
    // console.log('Full req.body:', req.body);
    const user_id = req.user.userId;
    const {name, email, description, address } = req.body;
    const result = await InstitutionModel.createInstitution({user_id ,name, email, description, address});
    res.status(201).json({ message: 'Institution created', id: result.id, name: name, email: email, description: description, address: address });
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function updateInstitution(req, res) {
  try {
    const user_id = req.user.userId;
    const { name, email, description, address } = req.body;

    // Optional: You can also pass `id` as param if needed (e.g., from req.params.id)
    const [institution] = await db.query('SELECT * FROM institutions WHERE user_id = ?', [user_id]);

    if (institution.length === 0) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Use the model function for update
    await InstitutionModel.updateInstitution({
      id: institution[0].id,
      user_id,
      name,
      email,
      description,
      address
    });

    res.status(200).json({
      message: 'Institution updated successfully',
      name,
      email,
      description,
      address
    });
  } catch (error) {
    console.error('Error updating institution:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
  }
}