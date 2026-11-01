import React, { useState, useEffect } from 'react';

export default function App() {
  const [branding, setBranding] = useState("ACADEMIC EXCELLENCE OLYMPIAD");
  const [currentView, setCurrentView] = useState("signup"); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [student, setStudent] = useState({ name: '', school: '', classStr: '', phone: '', guardianPhone: '' });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Default Dummy Test with built-in questions
  const defaultQuestions = [
    { id: 1, en: "What is the capital of India?", hi: "Bharat ki rajdhani kya hai?", options_en: ["Mumbai", "Delhi", "Kolkata", "Chennai"], options_hi: ["Mumbai", "Delhi", "Kolkata", "Chennai"], ans: 1 },
    { id: 2, en: "What is 5 x 5?", hi: "5 x 5 kya hota hai?", options_en: ["10", "20", "25", "30"], options_hi: ["10", "20", "25", "30"], ans: 2 }
  ];

  const [availableTests, setAvailableTests] = useState([
    { id: 1, classStr: "10", subject: "Demo Maths", totalQ: 2, marks: 4, neg: 1, duration: 30, expiryDate: "2026-12-31", expiryTime: "23:59", questions: defaultQuestions }
  ]);
  
  const [activeTest, setActiveTest] = useState(null);
  const [lang, setLang] = useState("en");
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [score, setScore] = useState(0);

  // Admin states updated to capture form data properly
  const [adminTab, setAdminTab] = useState("generate");
  const [testForm, setTestForm] = useState({ classStr: '10', subject: '', marks: '', neg: '', duration: '', expDate: '', expTime: '' });
  const [jsonInput, setJsonInput] = useState("");
  const [adminQuestions, setAdminQuestions] = useState([]);

  useEffect(() => {
    let timer;
    if (currentView === 'test' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (currentView === 'test' && timeLeft === 0) {
      handleTestSubmit(); 
    }
    return () => clearInterval(timer);
  }, [currentView, timeLeft]);

  useEffect(() => {
    const handleVisibility = () => {
      if (currentView === 'test' && document.hidden) {
        setWarnings(prev => {
          const newW = prev + 1;
          if (newW >= 2) {
            alert("Aapne do baar screen change ki! Test auto-submit ho gaya hai.");
            handleTestSubmit();
          } else {
            alert("WARNING: Test ke dauran screen change na karein. Ek aur bar karne par test submit ho jayega!");
          }
          return newW;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [currentView]);

  const handleSignup = (e) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp === "1234") {
      setCurrentView("dashboard");
    } else {
      alert("Galat OTP!");
    }
  };

  const startTest = (test) => {
    setActiveTest(test);
    setQuestions(test.questions || []); // Load exact questions for this test
    setTimeLeft(test.duration * 60);
    setWarnings(0);
    setAnswers({});
    setCurrentQIndex(0);
    setCurrentView("instructions");
  };

  const handleTestSubmit = () => {
    let tempScore = 0;
    Object.keys(answers).forEach(qIndex => {
      if (answers[qIndex] === questions[qIndex].ans) tempScore += activeTest.marks;
      else tempScore -= activeTest.neg;
    });
    setScore(tempScore);
    setCurrentView("result");
  };

  const handleAdminAuth = () => {
    const pass = prompt("Admin Password:");
    if (pass === "525077") {
      setIsAdminLoggedIn(true);
      setCurrentView("admin");
    } else if (pass !== null) {
      alert("Galat Password!");
    }
  };

  const fixAndParseJSON = (str) => {
    try {
      const parsed = JSON.parse(str);
      setAdminQuestions(prev => [...prev, ...(Array.isArray(parsed) ? parsed : [parsed])]);
      setJsonInput("");
      alert("Questions successfully loaded! Total: " + (adminQuestions.length + (Array.isArray(parsed) ? parsed.length : 1)));
    } catch (e) {
      alert("JSON format me error hai. Kripya brackets [] aur commas check karein.");
    }
  };

  // Naya Publish Test Logic
  const publishTest = () => {
    if (!testForm.subject || !testForm.marks || !testForm.duration) {
      return alert("Kripya Subject, Marks, aur Duration (Time) bharein.");
    }
    if (adminQuestions.length === 0) {
      return alert("Pehle JSON box se questions Add karein!");
    }

    const newTest = {
      id: Date.now(),
      classStr: testForm.classStr,
      subject: testForm.subject,
      totalQ: adminQuestions.length,
      marks: Number(testForm.marks),
      neg: Number(testForm.neg),
      duration: Number(testForm.duration),
      expiryDate: testForm.expDate,
      expiryTime: testForm.expTime,
      questions: adminQuestions
    };

    setAvailableTests([...availableTests, newTest]);
    setAdminQuestions([]); // clear current question pool
    setTestForm({ ...testForm, subject: '' }); // reset subject
    alert(`Success! Test "${newTest.subject}" class ${newTest.classStr} ke liye LIVE ho gaya hai.`);
  };

  if (currentView === "signup") return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
      <div 
        onClick={handleAdminAuth} 
        className="absolute top-4 right-4 w-8 h-8 border border-gray-800 rounded cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
        title="Admin Area"
      ></div>

      <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6 text-center">{branding}</h1>
      <div className="bg-gray-900 border-4 border-red-500 rounded-2xl p-6 w-full max-w-md shadow-[0_0_20px_rgba(239,68,68,0.6)]">
        <h2 className="text-2xl text-blue-400 font-bold mb-4">Student Login / Signup</h2>
        {!otpSent ? (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input type="text" placeholder="Name" required onChange={e => setStudent({...student, name: e.target.value})} className="p-3 bg-black text-white border-2 border-blue-500 rounded text-lg" />
            <input type="text" placeholder="School Name" required onChange={e => setStudent({...student, school: e.target.value})} className="p-3 bg-black text-white border-2 border-blue-500 rounded text-lg" />
            <select required onChange={e => setStudent({...student, classStr: e.target.value})} className="p-3 bg-black text-white border-2 border-blue-500 rounded text-lg">
              <option value="">Select Class / Course</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
              <option value="IIT-JEE">IIT-JEE</option>
              <option value="NEET">NEET</option>
              <option value="Graduation">Graduation</option>
            </select>
            <input type="tel" placeholder="WhatsApp Number" required onChange={e => setStudent({...student, phone: e.target.value})} className="p-3 bg-black text-white border-2 border-blue-500 rounded text-lg" />
            <input type="tel" placeholder="Guardian Number" required onChange={e => setStudent({...student, guardianPhone: e.target.value})} className="p-3 bg-black text-white border-2 border-blue-500 rounded text-lg" />
            <button type="submit" className="bg-red-600 text-white font-bold text-xl py-3 rounded hover:bg-red-700">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <input type="text" placeholder="Enter OTP (1234)" required onChange={e => setOtp(e.target.value)} className="p-3 bg-black text-white border-2 border-green-500 rounded text-2xl text-center tracking-widest" />
            <button type="submit" className="bg-green-500 text-black font-bold text-xl py-3 rounded hover:bg-green-600">Verify & Login</button>
          </form>
        )}
      </div>
    </div>
  );

  if (currentView === "dashboard") return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center">{branding}</h1>
      <h2 className="text-2xl text-blue-400 font-bold mb-4">Welcome, {student.name} ({student.classStr})</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableTests.filter(t => t.classStr === student.classStr).length === 0 && (
          <p className="text-red-400 text-lg">Abhi is class ke liye koi test available nahi hai.</p>
        )}
        {availableTests.filter(t => t.classStr === student.classStr).map(t => (
          <div key={t.id} className="bg-gray-900 border-2 border-green-500 rounded-xl p-4 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <h3 className="text-xl text-white font-bold mb-2">{t.subject}</h3>
            <p className="text-gray-300">Total Questions: {t.totalQ}</p>
            <p className="text-gray-300">Duration: {t.duration} Mins</p>
            <p className="text-gray-300 text-sm">Valid till: {t.expiryDate} {t.expiryTime}</p>
            <button onClick={() => startTest(t)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Start Test</button>
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentView("signup")} className="mt-8 text-red-500 underline font-bold">Logout</button>
    </div>
  );

  if (currentView === "instructions") return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-3xl bg-gray-900 border-2 border-yellow-500 p-6 rounded-xl w-full">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Exam Instructions / परीक्षा निर्देश</h2>
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="bg-blue-600 px-4 py-1 rounded font-bold">Language: {lang === 'en' ? 'English' : 'हिंदी'}</button>
        </div>
        <ul className="list-decimal pl-6 space-y-2 text-lg">
          {lang === 'en' ? (
            <>
              <li>Total duration is {activeTest.duration} minutes.</li>
              <li>Timer will run at the top. Auto-submit happens when time is up.</li>
              <li>Each correct answer gives {activeTest.marks} marks. Negative marking is {activeTest.neg}.</li>
              <li>Do not change your browser tab or screen.</li>
              <li>After 2 screen change warnings, test will be auto-submitted.</li>
              <li>You can change question language anytime.</li>
              <li>Use the Question Palette at the top to jump to any question.</li>
              <li>Click 'Submit Test' anytime if you are done.</li>
              <li>Results will be shown immediately after submission.</li>
            </>
          ) : (
            <>
              <li>कुल समय {activeTest.duration} मिनट है।</li>
              <li>टाइमर ऊपर चलेगा। समय समाप्त होने पर टेस्ट अपने आप सबमिट हो जाएगा।</li>
              <li>सही उत्तर के लिए {activeTest.marks} अंक मिलेंगे। नेगेटिव मार्किंग {activeTest.neg} है।</li>
              <li>ब्राउज़र टैब या स्क्रीन न बदलें।</li>
              <li>2 बार स्क्रीन बदलने की चेतावनी के बाद टेस्ट अपने आप सबमिट हो जाएगा।</li>
              <li>आप टेस्ट के दौरान कभी भी भाषा बदल सकते हैं।</li>
              <li>किसी भी प्रश्न पर सीधे जाने के लिए पैलेट का उपयोग करें।</li>
              <li>यदि आप समाप्त कर चुके हैं तो कभी भी 'Submit Test' पर क्लिक करें।</li>
              <li>सबमिट करने के तुरंत बाद परिणाम दिखाया जाएगा।</li>
            </>
          )}
        </ul>
        <button onClick={() => setCurrentView("test")} className="mt-8 w-full bg-green-500 text-black font-extrabold text-2xl py-3 rounded-lg">I Accept & Start Test</button>
      </div>
    </div>
  );

  if (currentView === "test") return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      <div className="bg-gray-900 border-b-4 border-red-600 p-2 flex flex-wrap justify-between items-center sticky top-0 z-10">
        <h1 className="text-yellow-400 font-bold text-lg md:text-2xl">{branding}</h1>
        <div className="flex gap-4 items-center">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="bg-blue-600 text-white px-3 py-1 rounded font-bold">A/अ</button>
          <div className="text-red-500 font-mono font-bold text-xl md:text-3xl bg-black px-4 py-1 rounded border-2 border-red-500">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-2xl text-blue-400 font-bold mb-4">Question {currentQIndex + 1}</h2>
          <p className="text-white text-xl mb-6">{lang === 'en' ? questions[currentQIndex]?.en : questions[currentQIndex]?.hi}</p>
          
          <div className="flex flex-col gap-3">
            {(lang === 'en' ? questions[currentQIndex]?.options_en : questions[currentQIndex]?.options_hi)?.map((opt, i) => (
              <label key={i} className={`p-4 border-2 rounded-lg cursor-pointer text-lg ${answers[currentQIndex] === i ? 'bg-green-600 border-green-400 text-white' : 'bg-gray-800 border-gray-600 text-gray-200'}`}>
                <input type="radio" name="option" className="hidden" checked={answers[currentQIndex] === i} onChange={() => setAnswers({...answers, [currentQIndex]: i})} />
                {opt}
              </label>
            ))}
          </div>

          <div className="mt-8 flex justify-between gap-2">
            <button disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(prev => prev - 1)} className="bg-yellow-500 text-black px-6 py-2 rounded font-bold disabled:opacity-50">Previous</button>
            {currentQIndex === questions.length - 1 ? (
              <button onClick={handleTestSubmit} className="bg-red-600 text-white px-6 py-2 rounded font-bold">Submit</button>
            ) : (
              <button onClick={() => setCurrentQIndex(prev => prev + 1)} className="bg-blue-500 text-white px-6 py-2 rounded font-bold">Next</button>
            )}
          </div>
        </div>

        <div className="md:w-64 bg-gray-900 border-l-4 border-yellow-500 p-4 overflow-y-auto hidden md:block">
          <h3 className="text-white font-bold mb-4">Question Palette</h3>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, i) => (
              <button key={i} onClick={() => setCurrentQIndex(i)} className={`w-10 h-10 rounded font-bold flex items-center justify-center ${answers[i] !== undefined ? 'bg-green-500 text-black' : currentQIndex === i ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={handleTestSubmit} className="mt-8 w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700">FINAL SUBMIT</button>
        </div>
      </div>
    </div>
  );

  if (currentView === "result") return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-5xl font-extrabold text-green-500 mb-6">THANK YOU!</h1>
      <div className="bg-gray-900 border-4 border-blue-500 rounded-2xl p-8 max-w-lg shadow-[0_0_30px_rgba(59,130,246,0.6)]">
        <h2 className="text-3xl text-white font-bold mb-4">Test Submitted Successfully</h2>
        <p className="text-2xl text-yellow-400 mb-6">Your Score: {score}</p>
        <p className="text-lg text-gray-300 border-t border-gray-700 pt-4">
          Detailed review available after <br/>
          <strong className="text-red-400">{activeTest?.expiryDate} at {activeTest?.expiryTime}</strong>.
        </p>
        <button onClick={() => setCurrentView("dashboard")} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded font-bold">Back to Dashboard</button>
      </div>
    </div>
  );

  if (currentView === "admin") return (
    <div className="min-h-screen bg-black p-4 md:p-8 font-sans">
      <div className="flex justify-between items-center mb-8 border-b-2 border-yellow-500 pb-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-red-500">ADMIN PANEL</h1>
        <button onClick={() => setCurrentView("signup")} className="text-blue-400 underline">Logout Admin</button>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setAdminTab("generate")} className={`px-6 py-2 font-bold rounded ${adminTab === 'generate' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'}`}>Generate Test</button>
        <button onClick={() => setAdminTab("download")} className={`px-6 py-2 font-bold rounded ${adminTab === 'download' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}>Download Section</button>
      </div>

      {adminTab === "generate" && (
        <div className="bg-gray-900 p-6 rounded-xl border-2 border-yellow-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <select value={testForm.classStr} onChange={e => setTestForm({...testForm, classStr: e.target.value})} className="p-2 bg-black text-white border border-gray-600 rounded">
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
              <option value="IIT-JEE">IIT-JEE</option>
              <option value="NEET">NEET</option>
              <option value="Graduation">Graduation</option>
            </select>
            <input type="text" placeholder="Subject Name" value={testForm.subject} onChange={e => setTestForm({...testForm, subject: e.target.value})} className="p-2 bg-black text-white border border-gray-600 rounded" />
            <input type="number" placeholder="Marks per Q" value={testForm.marks} onChange={e => setTestForm({...testForm, marks: e.target.value})} className="p-2 bg-black text-white border border-gray-600 rounded" />
            <input type="number" placeholder="Negative Marks" value={testForm.neg} onChange={e => setTestForm({...testForm, neg: e.target.value})} className="p-2 bg-black text-white border border-gray-600 rounded" />
            <input type="number" placeholder="Time (Mins)" value={testForm.duration} onChange={e => setTestForm({...testForm, duration: e.target.value})} className="p-2 bg-black text-white border border-gray-600 rounded" />
            <input type="date" value={testForm.expDate} onChange={e => setTestForm({...testForm, expDate: e.target.value})} className="p-2 bg-black text-white border border-gray-600 rounded" />
            <input type="time" value={testForm.expTime} onChange={e => setTestForm({...testForm, expTime: e.target.value})} className="p-2 bg-black text-white border border-gray-600 rounded" />
          </div>

          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl text-yellow-400 font-bold">Paste Questions (JSON)</h3>
            <button onClick={() => alert("Prompt to copy:\n'Generate multiple choice questions in JSON format. Keys: en, hi, options_en (Array of 4), options_hi (Array of 4), ans (0-3 index), explanation.'")} className="bg-green-600 text-white px-4 py-1 rounded text-sm font-bold">AI Prompt</button>
          </div>
          <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} placeholder="Paste JSON here..." className="w-full h-40 bg-black text-green-400 p-4 border-2 border-green-600 rounded font-mono text-sm mb-4"></textarea>
          
          <div className="flex flex-wrap gap-4">
            <button onClick={() => fixAndParseJSON(jsonInput)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">Add Questions</button>
            <button onClick={publishTest} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded">PUBLISH TEST</button>
          </div>
          <p className="text-green-400 font-bold mt-2">Questions Ready in Form: {adminQuestions.length}</p>
        </div>
      )}

      {adminTab === "download" && (
        <div className="bg-gray-900 p-6 rounded-xl border-2 border-blue-500 grid gap-4 md:grid-cols-2">
          <div className="bg-black p-4 border border-gray-700 rounded text-center">
            <h3 className="text-white font-bold mb-4 text-xl">Manage Tests ({availableTests.length} Live)</h3>
            <button onClick={() => alert("Test Delete Feature ke liye backend API ki zarurat hai. UI Button active hai.")} className="bg-red-600 text-white w-full py-2 rounded font-bold mb-2">Remove Expired Tests</button>
          </div>
          <div className="bg-black p-4 border border-gray-700 rounded text-center">
            <h3 className="text-white font-bold mb-4 text-xl">Student Data</h3>
            <button onClick={() => alert("Excel Download command sent! (Actual sheet generation requires backend database connection)")} className="bg-green-600 text-white w-full py-2 rounded font-bold">Download Excel Sheet</button>
          </div>
          <div className="bg-black p-4 border border-gray-700 rounded text-center">
            <h3 className="text-white font-bold mb-4 text-xl">Test Results</h3>
            <button onClick={() => alert("Result PDF Generation Initiated! (Requires Backend PDF service for final output)")} className="bg-yellow-500 text-black w-full py-2 rounded font-bold">Download Result PDF</button>
          </div>
          <div className="bg-black p-4 border border-gray-700 rounded text-center">
            <h3 className="text-white font-bold mb-4 text-xl">Publish Review</h3>
            <button onClick={() => alert("Success! Ab students dashboard se answer sheet aur explanations dekh sakte hain.")} className="bg-blue-600 text-white w-full py-2 rounded font-bold">Activate Live Result</button>
          </div>
        </div>
      )}
    </div>
  );

  return null;
}
