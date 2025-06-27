// StepFormWrapper.jsx
import React, { useState } from 'react';
import Step1PersonalDetails from './Step1PersonalDetails';
import Step2CareerGoals from './Step2CareerGoals';
import Step3SkillsExperience from './Step3SkillsExperience';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // your axios instance

const UserInfo = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleNext = async (data) => {
    const combinedData = { ...formData, ...data };

    if (step < 3) {
      setFormData(combinedData);
      setStep(step + 1);
    } else {
      // Final submit
      try {
        await api.post('/profile', combinedData);
        console.log('Submitting formData:', combinedData);
        navigate('/roadmap', { state: combinedData });
      } catch (err) {
        console.error('Profile submission failed:', err);
        console.log('Submitting formData:', combinedData);
        alert('Failed to submit profile. Try again.');
      }
    }
  };

  const handlePrev = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101C2B] via-[#1F2D3D] to-[#101C2B] text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="mb-4 text-center text-white/60 text-sm">
          Step {step} of 3
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 mb-6">
          <div className={`h-2 rounded-full bg-[#00ADB5] transition-all duration-300`} style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        {step === 1 && <Step1PersonalDetails onNext={handleNext} />}
        {step === 2 && <Step2CareerGoals onNext={handleNext} onBack={handlePrev} />}
        {step === 3 && <Step3SkillsExperience onNext={handleNext} onBack={handlePrev} />}
      </div>
    </div>
  );
};

export default UserInfo