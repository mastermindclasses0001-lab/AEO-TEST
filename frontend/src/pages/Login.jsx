import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-themeBlack p-4">
      <div className="bg-themeDarkGray p-8 rounded-xl border border-themeBlue w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-themeYellow mb-2">ACADEMIC EXCELLENCE OLYMPIAD</h1>
        <h2 className="text-lg text-center text-themeBlue mb-6">Student Portal</h2>
        
        {step === 1 ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <input required placeholder="Student Name" className="w-full p-3 bg-black border border-gray-600 rounded text-white focus:border-themeBlue outline-none" />
            <input required placeholder="WhatsApp Number" type="tel" className="w-full p-3 bg-black border border-gray-600 rounded text-white focus:border-themeBlue outline-none" />
            <button type="submit" className="w-full bg-themeGreen hover:bg-green-600 text-black font-bold py-3 rounded transition-colors">
              Send OTP to WhatsApp
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-themeYellow text-center">Enter OTP sent to your WhatsApp</p>
            <input placeholder="Enter OTP" className="w-full p-3 bg-black border border-gray-600 rounded text-white focus:border-themeBlue outline-none text-center tracking-widest text-xl" />
            <button onClick={() => navigate('/instructions')} className="w-full bg-themeBlue hover:bg-blue-600 text-black font-bold py-3 rounded transition-colors">
              Verify & Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
