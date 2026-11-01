import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function Instructions() { const navigate = useNavigate(); return <div className="p-8"><button onClick={() => navigate('/exam')} className="bg-themeGreen p-2">Start Exam</button></div>; }
