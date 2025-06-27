import React, { useState } from 'react';

const Step2CareerGoals = ({ onNext, onBack }) => {
  const [form, setForm] = useState({
    preferredCareer: '',
    interestAreas: [],
    shortTermGoals: '',
    longTermGoals: '',
    dreamCompany: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
  
    setForm((prevForm) => {
      const interests = prevForm.interestAreas || [];
  
      return {
        ...prevForm,
        interestAreas: checked
          ? [...interests, value]
          : interests.filter((item) => item !== value),
      };
    });
  };
  
  return (
    <div className="max-w-xl mx-auto bg-[#1F2D3D] p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Step 2: Career Goals</h2>
      <div className="space-y-4">
      <select
  name="preferredCareer"
  value={form.preferredCareer}
  onChange={handleChange}
  className="w-full p-2 rounded bg-[#101C2B] text-white"
>
  <option value="">Select Preferred Career</option>
  <option value="Software Engineer">Software Engineer</option>
  <option value="Frontend Developer">Frontend Developer</option>
  <option value="Backend Developer">Backend Developer</option>
  <option value="Full Stack Developer">Full Stack Developer</option>
  <option value="Data Scientist">Data Scientist</option>
  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
  <option value="DevOps Engineer">DevOps Engineer</option>
  <option value="UI/UX Designer">UI/UX Designer</option>
  <option value="Product Manager">Product Manager</option>
  <option value="QA Engineer">QA Engineer</option>
  <option value="IT Support Specialist">IT Support Specialist</option>
  <option value="Cloud Engineer">Cloud Engineer</option>
</select>
<div className="w-full p-2 bg-[#101C2B] rounded text-white">
  <label className="block mb-2">Interest Areas:</label>
  {[
    "Problem Solving",
    "Design",
    "Mathematics",
    "Communication",
    "Research",
    "Teamwork",
    "Leadership",
    "Innovation",
    "Security",
    "Artificial Intelligence",
    "Data Analysis",
    "Cloud Computing",
  ].map((interest) => (
    <label key={interest} className="block mb-1">
      <input
        type="checkbox"
        name="interestAreas"
        value={interest}
        checked={form.interestAreas.includes(interest)}
        onChange={handleCheckboxChange}
        className="mr-2"
      />
      {interest}
    </label>
  ))}
</div>

        <textarea name="shortTermGoals" value={form.shortTermGoals} onChange={handleChange} placeholder="Short Term Goals" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <textarea name="longTermGoals" value={form.longTermGoals} onChange={handleChange} placeholder="Long Term Goals" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <input name="dreamCompany" value={form.dreamCompany} onChange={handleChange} placeholder="Dream Company (optional)" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <div className="flex justify-between">
          <button onClick={onBack} className="bg-gray-600 px-4 py-2 rounded">Back</button>
          <button onClick={() => onNext(form)} className="bg-[#00ADB5] px-4 py-2 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Step2CareerGoals;
