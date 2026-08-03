import React from 'react';

export default function InstructionManualModal({ isOpen, onClose }) {
  // If the modal isn't open, don't render anything
  if (!isOpen) return null;

  return (
    /* Full-screen backdrop overlay */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-300">
        
        {/* Modal Header */}
        <div className="bg-[#1E3A8A] text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="font-black text-xl uppercase tracking-wider">
              Police Dashboard - Button & Feature Guide
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-lg font-bold text-lg transition-colors"
            title="Close Manual"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Feature Breakdown */}
        <div className="p-6 overflow-y-auto space-y-6 text-gray-800 text-sm">
          
          {/* SECTION 1: HEADER CONTROLS */}
          <div>
            <h3 className="font-black text-base text-[#1E3A8A] uppercase border-b-2 border-blue-200 pb-1 mb-3 flex items-center gap-2">
              🛡️ Header Controls
            </h3>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-blue-900 uppercase">📖 Manual Button:</span> Opens this guide showing explanations for all dashboard functions.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-blue-900 uppercase">👤 Log-out:</span> Safely logs you out of the command center and returns to the login screen.
              </div>
            </div>
          </div>

          {/* SECTION 2: SIDEBAR CONTROLS */}
          <div>
            <h3 className="font-black text-base text-[#1E3A8A] uppercase border-b-2 border-blue-200 pb-1 mb-3 flex items-center gap-2">
              📂 Sidebar & Navigation
            </h3>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-gray-900 uppercase">Switch to History / Switch to Live:</span> Toggles the sidebar between active ongoing emergency feeds and closed/archived cases.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-gray-900 uppercase">📋 List View / 📊 Analytics:</span> (In History View) Switches between the printable list of archived reports and graphical statistical analytics.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-gray-900 uppercase">Select All Checkbox:</span> Selects or deselects all archived reports for batch printing.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-gray-900 uppercase">Layout Selector (Portrait / Landscape):</span> Changes the PDF page orientation before printing.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-gray-900 uppercase">🖨️ Print Selected to PDF:</span> Opens the browser print window formatted strictly for official PDF exports of checked reports.
              </div>
            </div>
          </div>

          {/* SECTION 3: INCIDENT DETAILS PANEL */}
          <div>
            <h3 className="font-black text-base text-[#1E3A8A] uppercase border-b-2 border-blue-200 pb-1 mb-3 flex items-center gap-2">
              🔍 Incident Action Panel
            </h3>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-blue-900 uppercase">📍 View on Map:</span> Opens Google Maps in a new tab pinpointing the exact coordinates or reported location.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-blue-900 uppercase"> Valid ID Preview:</span> Click the thumbnail of the citizen's ID to pop up a enlarged view for identity verification.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-blue-900 uppercase">Severity Level Dropdown:</span> Sets urgency rank (CRITICAL, HIGH, MEDIUM, LOW).
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-blue-900 uppercase">Dispatch Status Dropdown:</span> Changes dispatch state (DISPATCHED, FURTHER STUDY, CASE CLOSED).
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-blue-900 uppercase">Save & Update Record Button:</span> Saves changes directly to the Firebase database.
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-black px-6 py-2 rounded-lg transition-colors uppercase text-xs tracking-wider"
          >
            Got It
          </button>
        </div>

      </div>

      {/* Backdrop Click to Close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}