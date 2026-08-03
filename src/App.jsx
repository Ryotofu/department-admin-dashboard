import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import emailjs from '@emailjs/browser';
import { auth } from './firebase';

import FireDashboard from './pages/FireDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import MedicalDashboard from './pages/MedicalDashboard';

// EmailJS Credentials Configuration
const EMAILJS_SERVICE_ID = 'service_id265eu';
const EMAILJS_TEMPLATE_ID = 'template_jj65n7c';
const EMAILJS_PUBLIC_KEY = 'G7C0i2J4eS7lsxFN_';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 

    // Guard Clause: Prevent rapid double-click dispatches
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      // 1. Authenticate user credentials via Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email?.toLowerCase();

      // 2. Identify Department Route and Name
      let targetRoute = '/';
      let departmentName = 'Department Account';

      if (userEmail === 'dracotail14@gmail.com') {
        targetRoute = '/fire';
        departmentName = 'Fire Department';
      } else if (userEmail === 'u6411824@gmaill.com') {
        targetRoute = '/police';
        departmentName = 'Police Department';
      } else if (userEmail === 'vodkanamo@gmail.com') {
        targetRoute = '/medical';
        departmentName = 'Medical Department';
      }

      // 3. Construct professional HTML email content
      const loginTimestamp = new Date().toLocaleString();
      
      const htmlEmailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #334155;">
          
          <!-- Header Bar -->
          <div style="border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 16px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 18px; font-weight: 800;">LGU PORTAL SYSTEM</h2>
            <span style="color: #2563eb; font-size: 11px; font-weight: 700; text-transform: uppercase;">Official Account Notice</span>
          </div>

          <!-- Alert Body -->
          <p style="font-size: 14px; line-height: 1.5; margin-top: 0;">
            A sign-in activity was recorded for your <strong>${departmentName}</strong> account.
          </p>

          <!-- Callout Box -->
          <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 14px; margin: 16px 0; border-radius: 4px; font-size: 13px;">
            <strong>Login Timestamp:</strong> ${loginTimestamp}
          </div>

          <!-- Contact Details -->
          <p style="font-size: 13px; line-height: 1.5; color: #475569; margin-bottom: 8px;">
            If you did not perform this login, please contact support immediately:
          </p>

          <ul style="font-size: 13px; color: #334155; padding-left: 20px; margin: 0 0 16px 0; line-height: 1.6;">
            <li>Email: <a href="mailto:ethan_josh_nora@dlsl.edu.ph" style="color: #2563eb; font-weight: bold; text-decoration: none;">ethan_josh_nora@dlsl.edu.ph</a></li>
            <li>Phone: <strong>09561237956</strong></li>
          </ul>

          <!-- Footer Disclaimer -->
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 16px 0 10px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
            This is an automated system notification from the LGU Portal.
          </p>

        </div>
      `;

      // 4. Send email dispatch with raw HTML payload
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: userEmail,
            from_name: 'LGU Portal System',
            subject_title: 'LGU Portal System - Account Activity Alert',
            message: htmlEmailTemplate, // 👈 Expects {{{message}}} in EmailJS Dashboard
            reply_to: 'ethan_josh_nora@dlsl.edu.ph',
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log('HTML Security Alert Email dispatched successfully!');
      } catch (emailErr) {
        console.warn('Email dispatch warning:', emailErr);
      }

      // 5. Route authorized user to dashboard
      if (targetRoute !== '/') {
        navigate(targetRoute);
      } else {
        setError('Unauthorized department account.');
      }
    } catch (err) {
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 rounded shadow-md transition-colors disabled:opacity-50 cursor-pointer"
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