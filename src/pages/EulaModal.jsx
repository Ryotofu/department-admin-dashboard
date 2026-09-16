import React from 'react';

/**
 * EulaModal Component - Department Admin / Command Center Edition
 * 
 * Displays the End-User License Agreement tailored for LGU emergency dispatchers
 * handling incoming incident reports, citizen identity verification, and case resolution.
 * 
 * Props:
 * @param {boolean} isOpen - Controls visibility of the modal dialog.
 * @param {function} onClose - Callback function to close the modal.
 */
function EulaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-300 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="bg-[#1E3A8A] text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h2 className="font-black text-lg tracking-wider uppercase flex items-center gap-2">
            📜 Command Center EULA (Department Admin)
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/20 px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer"
            aria-label="Close EULA Modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-gray-800 text-sm leading-relaxed">
          <p className="font-bold text-xs text-gray-500 uppercase border-b pb-2">
            Last Updated: July 14, 2026 | Administrative Protocol Version 2.0
          </p>

          <p>
            This End-User License Agreement ("EULA") is a legal agreement between you (the "Department Admin" / "Command Center Dispatcher") and the developers of <strong>iReport: Real-Time Image-Based Incident Report and Response Platform</strong> for the Local Government Unit (LGU) of Mataasnakahoy.
          </p>

          <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded text-xs text-blue-900 font-semibold">
            <strong>Capstone Project Notice:</strong> Deployed for academic testing and evaluation by De La Salle Lipa Information Technology students: Castillo, Lana Lee L., Malasmas, Ira Denise M., Nora, Ethan Josh N., and Sales, Dave Anthony A.
          </div>

          <p className="italic text-xs text-gray-600">
            By authenticating into and operating the iReport Web Command Center, you explicitly agree to follow all operational protocols, confidentiality guidelines, and data protection mandates defined below.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">1. Authorized Administrative Access</h3>
              <p className="mt-1"><strong>Access Limits:</strong> Portal access is exclusively reserved for verified emergency dispatch officers of Mataasnakahoy (Police, Fire, and Medical units).</p>
              <p className="mt-1"><strong>Credential Security:</strong> Account credentials are strictly non-transferable. Every case status modification, severity override, and resolution note is logged under your active session.</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">2. Data Privacy & Confidentiality Compliance</h3>
              <p className="mt-1"><strong>PII Protection:</strong> In compliance with the Data Privacy Act of 2012 (RA 10173), administrators must protect all citizen personal data, contact details, and submitted valid identification images.</p>
              <p className="mt-1"><strong>Anonymous Audit Protocol:</strong> Unmasked reporter email addresses and government IDs provided for anonymous reports are strictly for administrative fraud verification and legal auditing. Disclosing citizen identities to unauthorized third parties is strictly prohibited.</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">3. Incident Lifecycle & Dispatch Rules</h3>
              <p className="mt-1"><strong>Severity & Dispatch Updates:</strong> Admins are responsible for verifying citizen-submitted 4-angle incident evidence before setting severity levels (Critical, High, Medium, Low) and updating status fields (Dispatched, Awaiting Closure, Further Study, Case Closed).</p>
              <p className="mt-1"><strong>Resolution Documentation:</strong> Closing a case requires submitting accurate department resolution notes and verification photo evidence into the multi-agency record system.</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">4. Official Print Dossier Distribution</h3>
              <p className="mt-1"><strong>Confidential Dossiers:</strong> Generated PDF dossiers printed from the History Archive contain sensitive incident logs and visual evidence. These documents are classified as confidential LGU records and must be handled in accordance with official department record management rules.</p>
            </div>

            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider">5. Liability & Redundancy Disclaimer</h3>
              <p className="mt-1"><strong>System Redundancy:</strong> While iReport provides real-time emergency dispatching, Command Center operations should maintain standard radio frequencies and telephone dispatch lines to ensure continuous service during network interruptions.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs uppercase px-5 py-2 rounded shadow transition-all cursor-pointer"
          >
            Acknowledge & Close EULA
          </button>
        </div>

      </div>
    </div>
  );
}

export default EulaModal;