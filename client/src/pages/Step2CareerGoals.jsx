import React, { useState } from 'react';

const Step2CareerGoals = ({ onNext, onBack }) => {
  const [form, setForm] = useState({
    preferredCareer: '',
    interestAreas: '',
    shortTermGoals: '',
    longTermGoals: '',
    dreamCompany: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-xl mx-auto bg-[#1F2D3D] p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Step 2: Career Goals</h2>
      <div className="space-y-4">
        <input name="preferredCareer" value={form.preferredCareer} onChange={handleChange} placeholder="Preferred Career Path" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <input name="interestAreas" value={form.interestAreas} onChange={handleChange} placeholder="Interest Areas (comma separated)" className="w-full p-2 rounded bg-[#101C2B] text-white" />
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
