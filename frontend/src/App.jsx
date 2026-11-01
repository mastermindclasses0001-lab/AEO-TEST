import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Instructions from './pages/Instructions';
import Exam from './pages/Exam';
import AdminDashboard from './pages/AdminDashboard';
import ResultWait from './pages/ResultWait';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-themeBlack text-white font-sans">
        <AdminTrigger />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/result" element={<ResultWait />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

const AdminTrigger = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [show, setShow] = useState(false);

  return (
    <div className="absolute top-0 right-0 p-2 z-50">
      <div 
        className="w-4 h-4 cursor-pointer opacity-10 hover:opacity-100 bg-themeDarkGray rounded"
        onClick={() => setShow(!show)}
      ></div>
      {show && (
        <input 
          type="password"
          className="mt-2 p-1 bg-themeDarkGray text-themeYellow border border-themeBlue rounded w-24 text-xs"
          placeholder="PIN"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            if (e.target.value === '525077') {
              setShow(false);
              navigate('/admin');
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
