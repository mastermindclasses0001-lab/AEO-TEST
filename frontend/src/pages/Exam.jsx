import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Exam() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [currentQ, setCurrentQ] = useState(0);

  const questions = [
    { en: "What is the SI unit of Force?", hi: "बल का SI मात्रक क्या है?", opts: ["Newton", "Joule", "Pascal", "Watt"] },
    { en: "Solve: 2 + 2 * 2", hi: "हल करें: 2 + 2 * 2", opts: ["8", "6", "4", "10"] }
  ];

  return (
    <div className="min-h-screen bg-themeBlack flex flex-col p-4 text-white">
      <h2>Exam Portal</h2>
      <button onClick={() => navigate('/result')} className="bg-themeRed px-4 py-2 mt-4 rounded">Submit</button>
    </div>
  );
}
