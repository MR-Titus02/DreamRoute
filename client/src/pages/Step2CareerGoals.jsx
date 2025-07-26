import React, { useState } from 'react';

const interestOptions = [
  "Problem Solving", "Design", "Mathematics", "Communication", "Research",
  "Teamwork", "Leadership", "Innovation", "Security", "Artificial Intelligence",
  "Data Analysis", "Cloud Computing",
];

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

  const toggleInterest = (interest) => {
    setForm((prev) => {
      const isSelected = prev.interestAreas.includes(interest);
      return {
        ...prev,
        interestAreas: isSelected
          ? prev.interestAreas.filter((i) => i !== interest)
          : [...prev.interestAreas, interest],
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.preferredCareer) newErrors.preferredCareer = "Preferred career is required.";
    if (form.interestAreas.length === 0) newErrors.interestAreas = "Select at least one interest area.";
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
        {/* Preferred Career */}
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

        {/* Interest Areas - Tag Style */}
        <div>
          <label className="block mb-2">Interest Areas:</label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const isSelected = form.interestAreas.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full border transition ${
                    isSelected
                      ? 'bg-[#00ADB5] text-white border-[#00ADB5]'
                      : 'bg-[#101C2B] text-gray-300 border-gray-600 hover:border-[#00ADB5]'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
          {errors.interestAreas && (
            <p className="text-red-400 text-sm mt-1">{errors.interestAreas}</p>
          )}
        </div>

        {/* Short Term Goals */}
        <div>
          <textarea
            name="shortTermGoals"
            value={form.shortTermGoals}
            onChange={handleChange}
            placeholder="Short Term Goals (optional)"
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          />
        </div>

        {/* Long Term Goals */}
        <div>
          <textarea
            name="longTermGoals"
            value={form.longTermGoals}
            onChange={handleChange}
            placeholder="Long Term Goals (optional)"
            className="w-full p-2 rounded bg-[#101C2B] text-white"
          />
        </div>

        {/* Dream Company */}
        <input
          name="dreamCompany"
          value={form.dreamCompany}
          onChange={handleChange}
          placeholder="Dream Company (optional)"
          className="w-full p-2 rounded bg-[#101C2B] text-white"
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button onClick={onBack} className="bg-gray-600 px-4 py-2 rounded">Back</button>
          <button onClick={handleSubmit} className="bg-[#00ADB5] px-4 py-2 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Step2CareerGoals;
