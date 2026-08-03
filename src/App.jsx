import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import FireDashboard from './pages/FireDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import MedicalDashboard from './pages/MedicalDashboard';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); 
    setError('');

    if (password !== 'testing123') {
      setError('Incorrect password.');
      return;
    }

    if (email === 'firedept@gmail.com') {
      navigate('/fire');
    } else if (email === 'policedept@gmail.com') {
      navigate('/police');
    } else if (email === 'medicaldept@gmail.com') {
      navigate('/medical');
    } else {
      setError('Email not found.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-md w-full border-t-8 border-blue-600">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-800 tracking-wider mb-1">LGU PORTAL</h1>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-sm">Department Admin</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded font-bold text-center text-sm">{error}</div>}

          <div>
            <label className="block text-gray-700 font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="firedept@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 rounded shadow-md transition-colors">
            LOGIN TO DASHBOARD
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
            <p>Testing: firedept@gmail.com | policedept@gmail.com | medicaldept@gmail.com</p>
            <p>Password: testing123</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/fire" element={<FireDashboard />} />
        {/* We will update Police and Medical later */}
        <Route path="/police" element={<PoliceDashboard />} />
        <Route path="/medical" element={<MedicalDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;