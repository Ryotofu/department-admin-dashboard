import React from 'react';

// Department theme configuration dictionary
const DEPARTMENT_CONFIG = {
  police: {
    title: 'Police Manual & Feature Guide',
    icon: '👮‍♂️',
    headerBg: 'bg-blue-900',
    accentText: 'text-blue-900',
    accentBorder: 'border-blue-200',
    buttonBg: 'bg-blue-900 hover:bg-blue-800',
    closeHover: 'hover:bg-blue-800',
  },
  fire: {
    title: 'Fire Manual & Feature Guide',
    icon: '🚒',
    headerBg: 'bg-red-700',
    accentText: 'text-red-700',
    accentBorder: 'border-red-200',
    buttonBg: 'bg-red-700 hover:bg-red-800',
    closeHover: 'hover:bg-red-800',
  },
  health: {
    title: 'Health Manual & Feature Guide',
    icon: '🚑',
    headerBg: 'bg-emerald-700',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-200',
    buttonBg: 'bg-emerald-700 hover:bg-emerald-800',
    closeHover: 'hover:bg-emerald-800',
  },
};

export default function InstructionManualModal({ isOpen, onClose, department = 'police' }) {
  if (!isOpen) return null;

  // Fallback to 'police' theme if an invalid department string is passed
  const theme = DEPARTMENT_CONFIG[department.toLowerCase()] || DEPARTMENT_CONFIG.police;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-300">
        
        {/* Modal Header */}
        <div className={`${theme.headerBg} text-white p-4 flex justify-between items-center shrink-0 transition-colors`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{theme.icon}</span>
            <h2 className="font-black text-xl uppercase tracking-wider">
              {theme.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`text-gray-300 hover:text-white ${theme.closeHover} px-3 py-1 rounded-lg font-bold text-lg transition-colors`}
            title="Close Manual"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-gray-800 text-sm">
          
          {/* SECTION 1: HEADER CONTROLS */}
          <div>
            <h3 className={`font-black text-base ${theme.accentText} uppercase border-b-2 ${theme.accentBorder} pb-1 mb-3 flex items-center gap-2`}>
              🛡️ Header Controls
            </h3>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className={`font-black ${theme.accentText} uppercase`}>📖 Manual Button:</span> Opens this guide showing explanations for all dashboard functions.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className={`font-black ${theme.accentText} uppercase`}>👤 Log-out:</span> Safely logs you out of the command center and returns to the login screen.
              </div>
            </div>
          </div>

          {/* SECTION 2: SIDEBAR CONTROLS */}
          <div>
            <h3 className={`font-black text-base ${theme.accentText} uppercase border-b-2 ${theme.accentBorder} pb-1 mb-3 flex items-center gap-2`}>
              📂 Sidebar & Navigation
            </h3>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-gray-900 uppercase">Switch to History / Switch to Live:</span> Toggles the sidebar between active ongoing emergency feeds and closed/archived cases.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-gray-900 uppercase">📋 List View / 📊 Analytics:</span> (In History View) Switches between printable lists and graphical statistical analytics.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-black text-gray-900 uppercase">🖨️ Print Selected to PDF:</span> Formatted exports for official archived reports.
              </div>
            </div>
          </div>

          {/* SECTION 3: INCIDENT DETAILS PANEL */}
          <div>
            <h3 className={`font-black text-base ${theme.accentText} uppercase border-b-2 ${theme.accentBorder} pb-1 mb-3 flex items-center gap-2`}>
              🔍 Incident Action Panel
            </h3>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className={`font-black ${theme.accentText} uppercase`}>📍 View on Map:</span> Opens Google Maps pinpointing exact coordinates.
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className={`font-black ${theme.accentText} uppercase`}>Dispatch Status Dropdown:</span> Changes dispatch state (DISPATCHED, FURTHER STUDY, CASE CLOSED).
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className={`${theme.buttonBg} text-white font-black px-6 py-2 rounded-lg transition-colors uppercase text-xs tracking-wider`}
          >
            Got It
          </button>
        </div>

      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}