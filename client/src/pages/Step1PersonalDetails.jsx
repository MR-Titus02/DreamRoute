import React, { useState } from 'react';

const Step1PersonalDetails = ({ onNext }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    location: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const age = new Date().getFullYear() - new Date(form.dob).getFullYear();
    onNext({ ...form, age });
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1F2D3D] p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Step 1: Personal Details</h2>
      <div className="space-y-4">
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 rounded bg-[#101C2B] text-white">
          <option value="" disabled hidden>Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location (City, Country)" className="w-full p-2 rounded bg-[#101C2B] text-white" />
        <button onClick={handleSubmit} className="bg-[#00ADB5] px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
};

export default Step1PersonalDetails;