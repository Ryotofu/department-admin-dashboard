import React from 'react';

function EulaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-300 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="bg-[#1E3A8A] text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h2 className="font-black text-lg tracking-wider uppercase flex items-center gap-2">
            📜 End-User License Agreement (EULA)
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 px-2.5 py-1 rounded-full font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-gray-800 text-sm leading-relaxed">
          <p className="font-bold text-xs text-gray-500 uppercase border-b pb-2">
            Last Updated: July 14, 2026
          </p>

          <p>
            This End-User License Agreement ("EULA") is a legal agreement between you (the "Citizen User" / "Reporter") and the developers and administrators of <strong>iReport: Real-Time Image-Based Incident Report and Response Platform</strong> for the Local Government Unit (LGU) of Mataasnakahoy, Lipa City.
          </p>

          <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded text-xs text-blue-900 font-semibold">
            <strong>Capstone Project Notice:</strong> This application is developed and deployed strictly for the Capstone 2 project purposes of the following Information Technology (IT) students of De La Salle Lipa: Castillo, Lana Lee L., Malasmas, Ira Denise M., Nora, Ethan Josh N., and Sales, Dave Anthony A.
          </div>

          <p className="italic text-xs text-gray-600">
            By registering an account and using the iReport platform, you explicitly agree to be bound by the terms and conditions of this EULA. If you do not agree, do not use the application.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">1. User Eligibility and Registration</h3>
              <p className="mt-1"><strong>Identity Verification:</strong> Access is restricted to verified residents of Mataasnakahoy. Valid government or student ID submission is required during registration.</p>
              <p className="mt-1"><strong>Accountability:</strong> You confirm that all submitted registration details are accurate.</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">2. Scope of Service and Limitations</h3>
              <p className="mt-1"><strong>Geographical Limits:</strong> Reports submitted outside Mataasnakahoy GPS coordinates will be automatically rejected.</p>
              <p className="mt-1"><strong>Incident Categories:</strong> Only Vehicle Accidents, Health Emergencies, and Fire Incidents are supported.</p>
              <p className="mt-1"><strong>Submission Format:</strong> Requires a mandatory 4-angle (N, E, S, W) image capture format. Video uploads and offline reporting are not supported.</p>
              <p className="mt-1"><strong>Requirements:</strong> Android 8.0+ operating system and active internet connection (4G/5G/Wi-Fi).</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">3. User Responsibilities and Anonymity</h3>
              <p className="mt-1"><strong>Anonymous Reporting:</strong> Identity is hidden from public views, but LGU Department Heads retain full audit visibility of verified IDs to prevent abuse.</p>
              <p className="mt-1"><strong>Prank Reports:</strong> Fraudulent reporting results in immediate account deactivation and potential legal action.</p>
              <p className="mt-1"><strong>Emergency Hotlines:</strong> Dial 911 directly during system outages or critical emergencies.</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">4. Data Privacy and Lifecycle Management</h3>
              <p className="mt-1">Compliant with the Data Privacy Act of 2012. Features automated AI bystander face blurring. Records are kept in active storage for 1 year, archived for 5 years, and permanently deleted thereafter.</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">5. ARTA Compliance and Feedback</h3>
              <p className="mt-1">In compliance with RA 11032 (Ease of Doing Business Act), digital feedback and complaint forms are accessible within application settings.</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">6. Disclaimer of Liability</h3>
              <p className="mt-1">Provided on an "as-is" basis for academic capstone evaluation. Developers and LGU entities are exempt from liability regarding dispatch delays caused by device or network failures.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs uppercase px-5 py-2 rounded shadow transition-all"
          >
            Close EULA
          </button>
        </div>

      </div>
    </div>
  );
}

export default EulaModal;