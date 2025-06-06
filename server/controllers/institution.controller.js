// controllers/institutionController.js
import * as InstitutionModel from '../models/institutionModel.js';

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
    const { name, email, phone, latitude, longitude } = req.body;
    const result = await InstitutionModel.createInstitution({ name, email, phone, latitude, longitude });
    res.status(201).json({ message: 'Institution created', id: result.id });
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateInstitution(req, res) {
  try {
    const institutionId = req.params.id;
    const { name, email, phone, latitude, longitude } = req.body;

    const result = await InstitutionModel.updateInstitution(institutionId, { name, email, phone, latitude, longitude });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    
    res.json({ message: 'Institution updated successfully' });
  } catch (error) {
    console.error('Error updating institution:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteInstitution(req, res) {
  try {
    const institutionId = req.params.id;
    const result = await InstitutionModel.deleteInstitution(institutionId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    
    res.json({ message: 'Institution deleted successfully' });
  } catch (error) {
    console.error('Error deleting institution:', error);
    res.status(500).json({ message: 'Server error' });
  }
}