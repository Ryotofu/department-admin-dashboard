import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// 1. Import Firebase auth methods and initialized auth instance
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Adjust this path if your firebase configuration file is located elsewhere

import FireDashboard from './pages/FireDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import MedicalDashboard from './pages/MedicalDashboard';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      // 2. Authenticate user credentials with Firebase Cloud
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email?.toLowerCase();

      // 3. Navigate user based on authenticated account email
      if (userEmail === 'firedept@gmail.com') {
        navigate('/fire');
      } else if (userEmail === 'policedept@gmail.com') {
        navigate('/police');
      } else if (userEmail === 'medicaldept@gmail.com') {
        navigate('/medical');
      } else {
        setError('Unauthorized department account.');
      }
    } catch (err) {
      // Handle Firebase authentication errors gracefully
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/user-not-found'
      ) {
        setError('Invalid email or password.');
      } else {
        setError('Failed to log in. Please check your network connection.');
      }
    } finally {
      setLoading(false);
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
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded font-bold text-center text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@department.gov"
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 rounded shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN TO DASHBOARD'}
          </button>
        </form>
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
        <Route path="/police" element={<PoliceDashboard />} />
        <Route path="/medical" element={<MedicalDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;