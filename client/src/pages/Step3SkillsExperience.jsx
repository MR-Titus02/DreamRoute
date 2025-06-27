import React, { useState } from 'react';

const Step3SkillsExperience = ({ onNext, onBack }) => {
  const [form, setForm] = useState({
    educationLevel: '',
    studyLanguage: '',
    budget: '',
    experience: '',
    certifications: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-xl mx-auto bg-[#1F2D3D] p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Step 3: Skills & Preferences</h2>
      <div className="space-y-4">
        <select name="educationLevel" value={form.educationLevel} onChange={handleChange} className="w-full p-2 rounded bg-[#101C2B] text-white">
          <option value="" disabled hidden>Select Education Level</option>
          <option>High School</option>
          <option>Diploma</option>
          <option>Undergraduate</option>
          <option>Postgraduate</option>
          <option>Other</option>
        </select>
       
        <select name="studyLanguage" value={form.studyLanguage} onChange={handleChange} className="w-full p-2 rounded bg-[#101C2B] text-white">
          <option value="" disabled hidden>Preferred Language</option>
          <option>English</option>
          <option>Tamil</option>
          <option>Sinhala</option>
        </select>
        <select name="budget" value={form.budget} onChange={handleChange} className="w-full p-2 rounded bg-[#101C2B] text-white">
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
        <textarea name="experience" value={form.experience} onChange={handleChange} placeholder="Describe your past experience (if any)" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <input name="certifications" value={form.certifications} onChange={handleChange} placeholder="Relevant certifications (comma separated)" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <div className="flex justify-between">
          <button onClick={onBack} className="bg-gray-600 px-4 py-2 rounded">Back</button>
          <button onClick={() => onNext(form)} className="bg-[#00ADB5] px-4 py-2 rounded">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Step3SkillsExperience;
