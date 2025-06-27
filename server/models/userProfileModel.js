import db from '../config/db.js'; // Your MySQL connection

export async function createUserProfile(data) {
  const {
    user_id,
    fullName,
    email,
    dob,
    gender,
    location,
    preferredCareer,
    interestAreas,
    shortTermGoals,
    longTermGoals,
    dreamCompany,
    educationLevel,
    studyLanguage,
    budget,
    experience,
    certifications,
    age // ✅ include age
  } = data;

  const [result] = await db.query(
    `INSERT INTO career_profiles (
      user_id, full_name, email, dob, gender, location,
      preferred_career, interest_areas, short_term_goals, long_term_goals, dream_company,
      education_level, study_language, budget, experience, certifications, age
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      fullName,
      email,
      dob,
      gender,
      location,
      preferredCareer,
      JSON.stringify(interestAreas), // ✅ stored as JSON string
      shortTermGoals,
      longTermGoals,
      dreamCompany,
      educationLevel,
      studyLanguage,
      budget,
      experience,
      certifications,
      age // ✅ added here
    ]
  );

  return { id: result.insertId };
  

}

export async function getUserProfile(user_id) {
  const [rows] = await db.query(
    `SELECT * FROM career_profiles WHERE user_id = ?`,
    [user_id]
  );

  if (rows.length === 0) return null;

  // Parse JSON fields
  const profile = rows[0];
  profile.interest_areas = JSON.parse(profile.interest_areas || '[]');
  return profile;
}

export async function updateUserProfile(user_id, data) {
  const {
    fullName,
    email,
    dob,
    gender,
    location,
    preferredCareer,
    interestAreas,
    shortTermGoals,
    longTermGoals,
    dreamCompany,
    educationLevel,
    studyLanguage,
    budget,
    experience,
    certifications
  } = data;

  await db.query(
    `UPDATE career_profiles SET
      full_name = ?, email = ?, dob = ?, gender = ?, location = ?,
      preferred_career = ?, interest_areas = ?, short_term_goals = ?, long_term_goals = ?, dream_company = ?,
      education_level = ?, study_language = ?, budget = ?, experience = ?, certifications = ?
    WHERE user_id = ?`,
    [
      fullName,
      email,
      dob,
      gender,
      location,
      preferredCareer,
      JSON.stringify(interestAreas),
      shortTermGoals,
      longTermGoals,
      dreamCompany,
      educationLevel,
      studyLanguage,
      budget,
      experience,
      certifications,
      user_id
    ]
  );
}

export async function deleteUserProfile(user_id) {
  await db.query(
    `DELETE FROM career_profiles WHERE user_id = ?`,
    [user_id]
  );
}
