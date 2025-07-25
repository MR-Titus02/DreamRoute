import React, { useState, useEffect } from 'react';

const Step3SkillsExperience = ({ onNext, onBack, initialValues = {} }) => {
  const [form, setForm] = useState({
    educationLevel: '',
    studyLanguage: '',
    budget: '',
    experience: '',
    certifications: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState({});

  // Validate required fields
  const validate = () => {
    const newErrors = {};
    if (!form.educationLevel) newErrors.educationLevel = "Education level is required.";
    if (!form.studyLanguage) newErrors.studyLanguage = "Study language is required.";
    if (!form.budget) newErrors.budget = "Budget is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext(form);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1F2D3D] p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Step 3: Skills & Preferences</h2>
      <div className="space-y-4">
        <div>
          <select
            name="educationLevel"
            value={form.educationLevel}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          >
            <option value="" disabled hidden>Select Education Level</option>
            <option>High School</option>
            <option>Diploma</option>
            <option>Undergraduate</option>
            <option>Postgraduate</option>
            <option>Other</option>
          </select>
          {errors.educationLevel && (
            <p className="text-red-400 text-sm mt-1">{errors.educationLevel}</p>
          )}
        </div>

        <div>
          <select
            name="studyLanguage"
            value={form.studyLanguage}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          >
            <option value="" disabled hidden>Preferred Language</option>
            <option>English</option>
            <option>Tamil</option>
            <option>Sinhala</option>
          </select>
          {errors.studyLanguage && (
            <p className="text-red-400 text-sm mt-1">{errors.studyLanguage}</p>
          )}
        </div>

        <div>
          <select
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          >
            <option value="" disabled hidden>Budget Range</option>
            <option>No Cost</option>
            <option>Up to ₹5,000</option>
            <option>₹5,000 - ₹25,000</option>
            <option>₹25,000 - ₹1 Lakh</option>
            <option>₹1 Lakh - ₹5 Lakhs</option>
            <option>₹5 Lakhs - ₹10 Lakhs</option>
            <option>₹10 Lakhs - ₹20 Lakhs</option>
            <option>Above ₹20 Lakhs</option>
          </select>
          {errors.budget && (
            <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
          )}
        </div>

        <textarea
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Describe your past experience (if any)"
          className="w-full p-2 rounded bg-[#101C2B] text-white"
        />

        <input
          name="certifications"
          value={form.certifications}
          onChange={handleChange}
          placeholder="Relevant certifications (comma separated)"
          className="w-full p-2 rounded bg-[#101C2B] text-white"
        />

        <div className="flex justify-between pt-4">
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#00ADB5] hover:bg-[#00c7d1] text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3SkillsExperience;
