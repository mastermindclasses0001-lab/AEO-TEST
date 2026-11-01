import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Naam aur WhatsApp number dono dalein!");
      return;
    }
    setStep(2);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    // Default dummy OTP 1234 check
    if (otp === '1234') {
      setIsLoggedIn(true);
    } else {
      alert("Galat OTP! Kripya test OTP 1234 dalein.");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-yellow-400 mb-4 leading-tight">
          Welcome, {name}!
        </h1>
        <p className="text-xl sm:text-3xl text-blue-400 font-bold mb-4">Aapka portal successfully login ho gaya hai.</p>
        <p className="text-lg sm:text-2xl text-green-400">(Ab aap baki features check kar sakte hain)</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 font-sans w-full">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-yellow-400 mb-3 sm:mb-4 text-center tracking-wide leading-tight">
        ACADEMIC EXCELLENCE OLYMPIAD
      </h1>
      <h2 className="text-xl sm:text-2xl md:text-4xl text-blue-400 mb-6 sm:mb-10 font-bold text-center">
        Student Portal
      </h2>

      <div className="bg-gray-900 border-2 border-red-500 rounded-xl p-5 sm:p-8 w-full max-w-[90%] sm:max-w-md md:max-w-lg shadow-[0_0_15px_rgba(239,68,68,0.4)]">
        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="flex flex-col gap-4 sm:gap-6">
            <div>
              <label className="text-white text-base sm:text-xl mb-2 block font-semibold">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black text-yellow-300 border-2 border-blue-500 rounded-lg p-3 sm:p-4 text-base sm:text-xl focus:outline-none focus:border-yellow-400"
                placeholder="Apna naam likhein"
                required
              />
            </div>
            <div>
              <label className="text-white text-base sm:text-xl mb-2 block font-semibold">WhatsApp Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black text-yellow-300 border-2 border-blue-500 rounded-lg p-3 sm:p-4 text-base sm:text-xl focus:outline-none focus:border-yellow-400"
                placeholder="91XXXXXXXXXX"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg sm:text-2xl py-3 sm:py-4 rounded-lg mt-2 sm:mt-4 transition-all"
            >
              Send OTP to WhatsApp
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4 sm:gap-6">
            <div>
              <label className="text-white text-base sm:text-xl mb-2 block font-semibold">Enter OTP (Test: 1234)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-black text-yellow-300 border-2 border-blue-500 rounded-lg p-3 sm:p-4 text-2xl sm:text-3xl text-center tracking-widest focus:outline-none focus:border-yellow-400"
                placeholder="----"
                maxLength="4"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-extrabold text-lg sm:text-2xl py-3 sm:py-4 rounded-lg mt-2 sm:mt-4 transition-all"
            >
              Verify & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
