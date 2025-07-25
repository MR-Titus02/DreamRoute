import React, { useState } from 'react';

const Step2CareerGoals = ({ onNext, onBack, initialValues = {} }) => {
  const [form, setForm] = useState({
    preferredCareer: '',
    interestAreas: [],
    shortTermGoals: '',
    longTermGoals: '',
    dreamCompany: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const newAreas = checked
        ? [...prev.interestAreas, value]
        : prev.interestAreas.filter((item) => item !== value);
      return { ...prev, interestAreas: newAreas };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.preferredCareer) newErrors.preferredCareer = "Preferred career is required.";
    if (form.interestAreas.length === 0) newErrors.interestAreas = "Select at least one interest area.";
    // if (!form.shortTermGoals) newErrors.shortTermGoals = "Short-term goals are required.";
    // if (!form.longTermGoals) newErrors.longTermGoals = "Long-term goals are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onNext(form);
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1F2D3D] p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Step 2: Career Goals</h2>
      <div className="space-y-4 text-white">
        <div>
          <select
            name="preferredCareer"
            value={form.preferredCareer}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          >
            <option value="">Select Preferred Career</option>
            {[
              "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
              "Data Scientist", "Machine Learning Engineer", "Cybersecurity Analyst", "DevOps Engineer",
              "UI/UX Designer", "Product Manager", "QA Engineer", "IT Support Specialist", "Cloud Engineer"
            ].map((career) => (
              <option key={career} value={career}>{career}</option>
            ))}
          </select>
          {errors.preferredCareer && (
            <p className="text-red-400 text-sm mt-1">{errors.preferredCareer}</p>
          )}
        </div>

        <div className="w-full p-2 bg-[#101C2B] rounded">
          <label className="block mb-2">Interest Areas:</label>
          <div className="grid grid-cols-2 gap-x-4">
            {[
              "Problem Solving", "Design", "Mathematics", "Communication", "Research",
              "Teamwork", "Leadership", "Innovation", "Security", "Artificial Intelligence",
              "Data Analysis", "Cloud Computing",
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
          {errors.interestAreas && (
            <p className="text-red-400 text-sm mt-1">{errors.interestAreas}</p>
          )}
        </div>

        <div>
          <textarea
            name="shortTermGoals"
            value={form.shortTermGoals}
            onChange={handleChange}
            placeholder="Short Term Goals (optional)"
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          />
          {errors.shortTermGoals && (
            <p className="text-red-400 text-sm mt-1">{errors.shortTermGoals}</p>
          )}
        </div>

        <div>
          <textarea
            name="longTermGoals"
            value={form.longTermGoals}
            onChange={handleChange}
            placeholder="Long Term Goals (optional)"
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          />
          {errors.longTermGoals && (
            <p className="text-red-400 text-sm mt-1">{errors.longTermGoals}</p>
          )}
        </div>

        <input
          name="dreamCompany"
          value={form.dreamCompany}
          onChange={handleChange}
          placeholder="Dream Company (optional)"
          className="w-full p-2 rounded bg-[#101C2B] text-white"
        />

        <div className="flex justify-between">
          <button onClick={onBack} className="bg-gray-600 px-4 py-2 rounded">Back</button>
          <button onClick={handleSubmit} className="bg-[#00ADB5] px-4 py-2 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Step2CareerGoals;
