import React, { useState, useEffect } from 'react';

const Step1PersonalDetails = ({ onNext, initialValues = {} }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    location: '',
    ...initialValues, // preload values if coming back
  });

  const [errors, setErrors] = useState({});

  // Load user data from localStorage and prefill fullName and email only if not already filled
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm((prevForm) => ({
        ...prevForm,
        fullName: prevForm.fullName || user.name || '',
        email: prevForm.email || user.email || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = 'Full Name is required.';
    if (!form.email) newErrors.email = 'Email is required.';
    if (!form.dob) newErrors.dob = 'Date of Birth is required.';
    if (!form.gender) newErrors.gender = 'Gender is required.';
    // if (!form.location) newErrors.location = 'Location is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const age = new Date().getFullYear() - new Date(form.dob).getFullYear();
    onNext({ ...form, age });
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1F2D3D] p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Step 1: Personal Details</h2>
      <div className="space-y-4">
        <div>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          />
          {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          />
          {errors.dob && <p className="text-red-400 text-sm mt-1">{errors.dob}</p>}
        </div>

        <div>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          >
            <option value="" disabled hidden>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (City, Country)"
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          />
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#00ADB5] hover:bg-[#00c7d1] text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1PersonalDetails;
