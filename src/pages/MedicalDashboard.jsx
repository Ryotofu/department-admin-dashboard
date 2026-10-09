import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import HistoryAnalytics from './HistoryAnalytics';
import InstructionManualModal from './InstructionManualModal';
import IncomingReportModal from './IncomingReportModal';
import EulaModal from './EulaModal'; // Adjust relative path as needed
import AdminChatBox from './AdminChatBox';

function MedicalDashboard() {
  const [isEulaOpen, setIsEulaOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [incomingReport, setIncomingReport] = useState(null);
const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editSeverity, setEditSeverity] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [view, setView] = useState('ACTIVE'); 
  const [historyTab, setHistoryTab] = useState('LIST'); // 'LIST' or 'ANALYTICS'
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [isManualOpen, setIsManualOpen] = useState(false);

  // Print-specific States
  const [checkedReportIds, setCheckedReportIds] = useState([]);
  const [printOrientation, setPrintOrientation] = useState('portrait'); // 'portrait' or 'landscape'

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
      // Add this inside useEffect before mapping docs:
snapshot.docChanges().forEach((change) => {
  if (change.type === 'added') {
    const newDoc = { id: change.doc.id, ...change.doc.data() };
    const status = (newDoc.policeStatus || newDoc.status || 'PENDING').toUpperCase();
    if (status === 'PENDING') {
      setIncomingReport(newDoc);
      setIsAlarmOpen(true);
    }
  }
});
      const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const medicalReports = reportsData.filter(r => {
        const status = (r.medicalStatus || r.status || 'PENDING').toUpperCase();
        
        const isActiveStatus = status === 'PENDING' || status === 'DISPATCHED' || status === 'AWAITING CLOSURE';
        const statusMatch = view === 'HISTORY' ? !isActiveStatus : isActiveStatus;

        const title = (r.incidentTitle || '').toUpperCase();
        const role = (r.requestedRole || '').toUpperCase();
        const categoryMatch = 
          title.includes('MEDICAL') || 
          role.includes('MEDICAL') || 
          title.includes('HEALTH') || 
          title.includes('AMBULANCE');

        return statusMatch && categoryMatch;
      });

      medicalReports.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      
      setReports(medicalReports);
      
      if (selectedReport) {
        const updatedSelected = medicalReports.find(r => r.id === selectedReport.id);
        if (updatedSelected) {
          setSelectedReport(updatedSelected);
        }
      }
    });
    return () => unsubscribe();
  }, [view]);

  // Reset checked list when view changes
// Reset checked list and tab when view changes
  useEffect(() => {
    setCheckedReportIds([]);
    if (view === 'ACTIVE') setHistoryTab('LIST');
  }, [view]);

// LIVE SELECTION SYNC HOOK
  // Keeps the right panel updated if the currently viewed report gets modified in real time
  useEffect(() => {
    if (selectedReport) {
      const liveReportData = reports.find(r => r.id === selectedReport.id);
      if (liveReportData && JSON.stringify(liveReportData) !== JSON.stringify(selectedReport)) {
        setSelectedReport(liveReportData);
      }
    }
  }, [reports]);

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'No Date/Time';
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    return timestamp.toString();
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setIsIdModalOpen(false); // Reset modal state here!
    setEditSeverity(report.severity || 'LOW');
    setEditStatus(report.medicalStatus || report.status || 'PENDING');
  };

  const handleUpdate = async () => {
    if (!selectedReport) return;
    try {
        const reportRef = doc(db, 'reports', selectedReport.id);
        await updateDoc(reportRef, { 
          severity: editSeverity, 
          medicalStatus: editStatus 
        });
        
        alert(`Medical Record Updated Successfully!`);
        setSelectedReport(null); 
    } catch (error) {
        alert("Failed to update: " + error.message);
    }
  };

  // PRINT / CHECKBOX UTILITIES
  const handleToggleCheck = (e, reportId) => {
    e.stopPropagation(); // Stop side effects clicking card selection
    setCheckedReportIds(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId) 
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (checkedReportIds.length === reports.length) {
      setCheckedReportIds([]);
    } else {
      setCheckedReportIds(reports.map(r => r.id));
    }
  };

  const handlePrint = () => {
    if (checkedReportIds.length === 0) {
      alert("Please select at least one report to print!");
      return;
    }
    window.print();
  };

  return (
    <>
      {/* 🖨️ DYNAMIC PRINT CSS FOR ORIENTATION */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: ${printOrientation};
            margin: 15mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .break-page {
            page-break-after: always;
            break-after: page;
          }
        }
      `}} />

{/* ==================== MAIN DASHBOARD LAYOUT (Hidden on print) ==================== */}
<div className="h-screen w-full bg-gray-100 font-sans flex flex-col overflow-hidden print:hidden">
  
  <header className="bg-[#16A34A] text-white px-6 py-4 flex justify-between items-center shadow-md z-20 shrink-0">
    
    {/* Left Side: Medical Department Branding */}
    <div className="flex items-center gap-3">
      <span className="text-3xl">🚑</span>
      <h1 className="font-black text-2xl tracking-wider uppercase">MEDICAL DEPT COMMAND CENTER</h1>
    </div>

    {/* Right Side Container: Separates Action Buttons from the Logout Link */}
    <div className="flex items-center gap-4">
      
<div className="flex gap-2">
  <button 
    type="button"
    onClick={() => setIsEulaOpen(true)}
    className="px-3 py-1.5 bg-blue-900 border border-blue-400/30 text-white font-bold text-xs rounded hover:bg-blue-950 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
  >
    📜 EULA
  </button>
  <button 
    type="button"
    onClick={() => setIsManualOpen(true)}
    className="px-3 py-1.5 bg-blue-900 border border-blue-400/30 text-white font-bold text-xs rounded hover:bg-blue-950 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
  >
    📖 Manual
  </button>
</div>

      {/* 👤 Logout Navigation Link */}
      <Link 
        to="/" 
        className="flex items-center gap-2 hover:text-gray-200 transition-colors border-l border-green-400/50 pl-4 ml-1"
      >
        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-white/20">
          <span className="text-sm">👤</span>
        </div>
        <span className="font-semibold text-lg">Log-out</span>
      </Link>

    </div>

  </header>

        <main className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR */}
          <div className="w-[450px] bg-white border-r border-gray-300 flex flex-col z-10 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)]">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
              <h2 className="font-black text-lg text-gray-800 uppercase">
                {view === 'ACTIVE' ? '🚑 Live Reports' : '📂 Archived Cases'}
              </h2>
              <button 
                onClick={() => {
                    setView(view === 'ACTIVE' ? 'HISTORY' : 'ACTIVE');
                    setSelectedReport(null);
                }}
                className={`text-xs font-bold px-4 py-2 rounded shadow-sm transition-colors uppercase ${
                  view === 'ACTIVE' ? 'bg-gray-800 text-white hover:bg-black' : 'bg-[#16A34A] text-white hover:bg-green-700'
                }`}
              >
                SWITCH TO {view === 'ACTIVE' ? 'HISTORY' : 'LIVE'}
              </button>
            </div>
            {/* 📊 NEW: ANALYTICS TOGGLE */}
            {view === 'HISTORY' && (
              <div className="flex w-full bg-gray-200 p-1 shrink-0 border-b border-gray-300">
                <button 
                  onClick={() => setHistoryTab('LIST')}
                  className={`flex-1 py-1.5 text-xs font-black uppercase rounded shadow-sm transition-all ${historyTab === 'LIST' ? 'bg-white text-red-600' : 'text-gray-500 hover:bg-gray-300'}`}
                >
                  📋 List View
                </button>
                <button 
                  onClick={() => {
                    setHistoryTab('ANALYTICS');
                    setSelectedReport(null); 
                  }}
                  className={`flex-1 py-1.5 text-xs font-black uppercase rounded shadow-sm transition-all ${historyTab === 'ANALYTICS' ? 'bg-white text-red-600' : 'text-gray-500 hover:bg-gray-300'}`}
                >
                  📊 Analytics
                </button>
              </div>
            )}

            {/* 📁 PRINT ACTIONS BAR (Only in history view) */}
            {view === 'HISTORY' && historyTab === 'LIST' && (
              <div className="p-4 bg-green-50 border-b border-gray-200 flex flex-col gap-3 shrink-0">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={checkedReportIds.length === reports.length && reports.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Select All ({reports.length})</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-500 uppercase">Layout:</span>
                    <select 
                      value={printOrientation} 
                      onChange={(e) => setPrintOrientation(e.target.value)}
                      className="text-xs font-bold border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer"
                    >
                      <option value="portrait">Portrait 📄</option>
                      <option value="landscape">Landscape 📇</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handlePrint}
                  disabled={checkedReportIds.length === 0}
                  className="w-full bg-[#16A34A] hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-black py-2.5 px-4 rounded shadow transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  🖨️ Print Selected to PDF ({checkedReportIds.length})
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-100/50">
              {reports.length === 0 ? (
                  <p className="text-center py-10 font-bold text-gray-400 uppercase">No {view === 'HISTORY' ? 'Archived' : 'Active'} Reports</p>
              ) : (
                  reports.map((report) => {
                    const isSelected = selectedReport?.id === report.id;
                    const isChecked = checkedReportIds.includes(report.id);
                    const currentStatus = report.medicalStatus || report.status || 'PENDING';
                    return (
                      <div key={report.id} className="flex items-center gap-2.5">
                        {/* Checkbox for selection when history is loaded */}
                        {view === 'HISTORY' && historyTab === 'LIST' && (
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleToggleCheck(e, report.id)}
                            className="w-5 h-5 rounded text-[#16A34A] focus:ring-green-500 border-gray-300 cursor-pointer shrink-0 transition-all"
                          />
                        )}
                        <div 
                          onClick={() => handleSelectReport(report)}
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all shadow-sm flex-1 ${
                            isSelected 
                              ? 'bg-[#16A34A] border-green-700 text-white scale-[1.01]' 
                              : 'bg-white border-transparent hover:border-green-300 text-gray-800'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-black text-lg truncate max-w-[220px]">{report.incidentTitle || 'MEDICAL REPORT'}</div>
                            <div className={`text-xs font-bold px-2 py-1 rounded bg-black/10 shrink-0 ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                              {formatDateTime(report.createdAt).split(',')[0]}
                            </div>
                          </div>
                          <div className="text-sm font-bold opacity-90 truncate">📍 {report.location || report.address || 'Unknown'}</div>
                          <div className="text-sm font-bold opacity-90 truncate mt-1">
                            {report.isAnonymous ? (
                              <span className={isSelected ? 'text-white font-bold' : 'text-red-600'}>🕵️ Anonymous (Real: {report.actualReporterEmail || 'Unknown'})</span>
                            ) : (
                              `👤 ${report.reporterName || report.email || 'Unknown'}`
                            )}
                          </div>
                          
                          <div className={`mt-3 font-black text-xs uppercase inline-block px-2 py-1 rounded ${
                            currentStatus === 'CASE CLOSED' ? 'bg-blue-500/20 text-blue-800' : 
                            currentStatus === 'FURTHER STUDY' ? 'bg-yellow-500/20 text-yellow-700' : 
                            currentStatus === 'PENDING' && !isSelected ? 'bg-red-500/10 text-red-600' : 
                            'bg-black/20 text-inherit'
                          }`}>
                            STATUS: {currentStatus}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 bg-gray-200 overflow-y-auto p-8 flex justify-center">
            {view === 'HISTORY' && historyTab === 'ANALYTICS' ? (
              <HistoryAnalytics reports={reports} />
            ) : !selectedReport ? (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full opacity-50">
                <span className="text-8xl mb-4">🖥️</span>
                <h2 className="font-black text-2xl uppercase tracking-widest">Select a report to view details</h2>
              </div>
            ) : (
              <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl border border-gray-300 overflow-hidden flex flex-col h-fit">
                <div className={`p-6 text-white flex justify-between items-center ${view === 'HISTORY' ? 'bg-gray-700' : 'bg-[#16A34A]'}`}>
                  <div>
                    <h2 className="font-black text-3xl uppercase flex items-center gap-3">
                      {view === 'HISTORY' ? '📁' : '🚑'} {selectedReport.incidentTitle || 'MEDICAL EMERGENCY'}
                    </h2>
                    <p className="font-bold opacity-90 text-lg mt-1">Reported: {formatDateTime(selectedReport.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xl uppercase tracking-wider">Severity: {selectedReport.severity || 'HIGH'}</div>
                    <div className="font-bold opacity-90">{selectedReport.medicalStatus || selectedReport.status || 'PENDING'}</div>
                  </div>
                </div>

                <div className="p-8 flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-gray-50 p-5 rounded border border-gray-200 shadow-inner">
                      
                      {/* 📍 CLICKABLE LOCATION MAP */}
                      <div className="font-bold text-gray-500 text-sm uppercase mb-1">Location</div>
                      <div className="font-black text-xl mb-4">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedReport.location || selectedReport.address || 'Unknown')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2 w-fit transition-colors"
                          title="Click to open in Google Maps"
                        >
                          📍 {selectedReport.location || selectedReport.address || 'Unknown'}
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full no-underline ml-2 shadow-sm">
                            View on Map ↗
                          </span>
                        </a>
                      </div>
                      
                      {/* 👤 REPORTER & ID VISUALIZER */}
                      <div className="font-bold text-gray-500 text-sm uppercase mb-1">Reported By & Verification ID</div>
                      <div className="flex items-center gap-6 mb-4 bg-white p-3 border border-gray-200 rounded shadow-sm">
                        
                        {/* Email/Name Info */}
                        <div className="font-black text-lg text-gray-800 flex-1">
                          {selectedReport.isAnonymous ? (
                            <div className="flex flex-col gap-1 text-red-600">
                              <span className="flex items-center gap-2">🕵️ Anonymous Citizen</span>
                              <span className="text-xs bg-red-50 text-red-800 px-2 py-1 rounded border border-red-200 w-fit">
                                Real Email: {selectedReport.actualReporterEmail || 'Unknown'}
                              </span>
                            </div>
                          ) : (
                            <span className="flex items-center gap-2">👤 {selectedReport.reporterName || selectedReport.email || 'Unknown'}</span>
                          )}
                        </div>

                        {/* ID Image Display with Hover Zoom */}
                        <div className="shrink-0 flex flex-col items-center border-l-2 border-gray-200 pl-6">
                          {selectedReport.idImageBase64 ? (
                            <>
                              <div 
                                onClick={() => setIsIdModalOpen(true)} 
                                className="relative group cursor-pointer flex flex-col items-center"
                              >
                                <img 
                                  src={`data:image/jpeg;base64,${selectedReport.idImageBase64}`} 
                                  alt="Reporter Valid ID" 
                                  className="w-20 h-12 object-contain rounded border-2 border-blue-400 shadow-sm bg-black"
                                />
                                <span className="text-[10px] font-bold text-blue-600 tracking-wider mt-1 text-center block uppercase">
                                  Valid ID
                                </span>
                              </div>

                              {isIdModalOpen && (
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 p-4">
                                  <div className="relative bg-black border-4 border-blue-500 rounded-lg shadow-2xl overflow-hidden max-w-[500px] w-full">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsIdModalOpen(false);
                                      }}
                                      className="absolute top-2 right-3 text-white bg-red-600 hover:bg-red-700 font-bold text-sm px-2.5 py-1 rounded-full z-50 transition-colors shadow"
                                    >
                                      ✕
                                    </button>

                                    <div className="flex justify-center items-center w-full bg-black p-4 min-h-[350px]">
                                      <img 
                                        src={`data:image/jpeg;base64,${selectedReport.idImageBase64}`} 
                                        alt="Reporter Valid ID Enlarged" 
                                        className="max-w-full max-h-[70vh] object-contain rounded"
                                      />
                                    </div>

                                    <div className="bg-blue-600 text-white text-center font-black text-sm py-2 tracking-widest uppercase">
                                      Verified Citizen ID
                                    </div>
                                  </div>
                                  
                                  <div 
                                    className="absolute inset-0 -z-10" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsIdModalOpen(false);
                                    }}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-20 h-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-center">
                              <span className="text-[9px] font-bold text-gray-400 uppercase leading-tight">No ID<br/>Attached</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                     <div className="font-bold text-gray-500 text-sm uppercase mb-1 mt-2">Citizen Description</div>
<div className="font-semibold text-gray-700 bg-white p-3 border border-gray-300 rounded">
  {selectedReport.description || 'No description provided by citizen.'}
</div>

{/* 💬 MEDICAL DEPT ADMIN CHAT BOX */}
<AdminChatBox 
  reportId={selectedReport.id} 
  department="medical" 
  recipientEmail={selectedReport.actualReporterEmail || selectedReport.email} 
/>
                      <div className="font-semibold text-gray-700 bg-white p-3 border border-gray-300 rounded">
                        {selectedReport.description || 'No description provided by citizen.'}
                      </div>
                    </div>

                    {selectedReport.aiAnalysis?.invalidAngles?.length > 0 && (
                      <div className="p-4 bg-yellow-100 border-l-8 border-yellow-500 rounded shadow-sm">
                        <h4 className="font-black text-yellow-900 uppercase">⚠️ AI Verification Warning</h4>
                        <p className="font-bold text-yellow-800 mt-1">
                          Untrusted or blurry angles detected: {selectedReport.aiAnalysis.invalidAngles.join(', ')}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto bg-blue-50 p-6 rounded border border-blue-200">
                      <h3 className="font-black text-blue-900 uppercase mb-4 text-lg">Update Medical Status</h3>
                      <div className="flex flex-col xl:flex-row gap-4 mb-4">
                        <div className="flex-1">
                          <label className="font-black text-sm text-blue-800 uppercase block mb-2">Severity Level</label>
                          <select 
                            className="bg-white text-black font-bold p-3 w-full border-2 border-blue-300 rounded shadow-sm outline-none focus:border-blue-500"
                            value={editSeverity} 
                            onChange={(e) => setEditSeverity(e.target.value)}
                            disabled={view === 'HISTORY'}
                          >
                            <option value="CRITICAL">CRITICAL</option>
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                          </select>
                        </div>

                        <div className="flex-1">
                          <label className="font-black text-sm text-blue-800 uppercase block mb-2">Dispatch Status</label>
                          <select 
                            className="bg-white text-black font-bold p-3 w-full border-2 border-blue-300 rounded shadow-sm outline-none focus:border-blue-500"
                            value={editStatus} 
                            onChange={(e) => setEditStatus(e.target.value)}
                            disabled={view === 'HISTORY'}
                          >
                            {editStatus === 'PENDING' && <option value="PENDING" disabled>PENDING (Awaiting Action)</option>}
                            {editStatus === 'AWAITING CLOSURE' && <option value="AWAITING CLOSURE" disabled>AWAITING CLOSURE (Review)</option>}
                            {editStatus === 'FURTHER STUDY' && <option value="FURTHER STUDY" disabled>FURTHER STUDY</option>}
                            
                            <option value="DISPATCHED">DISPATCHED</option>
                            {editStatus !== 'FURTHER STUDY' && <option value="FURTHER STUDY">FURTHER STUDY</option>}
                            <option value="CASE CLOSED">CASE CLOSED</option>
                          </select>
                        </div>
                      </div>
                      
                      {view === 'ACTIVE' && (
                        <button 
                          onClick={handleUpdate} 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-3 rounded shadow-md transition-colors"
                        >
                          SAVE & UPDATE RECORD
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Images */}
                  <div className="w-full lg:w-[450px] shrink-0 flex flex-col items-center">
                    <div className="font-black text-lg mb-4 uppercase tracking-wider bg-black text-white w-full text-center py-2 rounded">
                      Incident Evidence (4 Angles)
                    </div>
                    
                    {selectedReport.anglesBase64 && typeof selectedReport.anglesBase64 === 'object' ? (
                      <div className="grid grid-cols-2 gap-3 w-full">
                        {['North', 'East', 'West', 'South'].map((direction) => {
                          const base64 = selectedReport.anglesBase64[direction];
                          return (
                            <div key={direction} className="relative bg-black rounded shadow-md h-[200px] overflow-hidden border-2 border-gray-800">
                              {base64 ? (
                                <>
                                  <img src={`data:image/jpeg;base64,${base64}`} alt={`${direction} view`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-4 pb-1">
                                    <div className="text-white font-black text-center uppercase tracking-widest text-sm">🧭 {direction.toUpperCase()}</div>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 font-bold uppercase bg-neutral-900">
                                  <span className="text-2xl mb-1">🧭</span>
                                  <span>{direction.toUpperCase()}</span>
                                  <span className="text-[10px] text-red-500 mt-1">MISSING</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : selectedReport.imageBase64 ? (
                      <div className="w-full h-[412px] border-2 border-gray-800 rounded shadow-md overflow-hidden bg-black relative">
                        <img src={`data:image/jpeg;base64,${selectedReport.imageBase64}`} alt="Legacy Single View" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-[412px] bg-neutral-900 text-gray-400 flex flex-col items-center justify-center font-bold border-2 border-gray-800 rounded shadow-md">
                        <span className="text-5xl mb-3">📷</span>NO IMAGES UPLOADED
                      </div>
                    )}

                    {/* MULTI-AGENCY RESOLUTION REPORTS */}
                    <div className="w-full mt-8 flex flex-col gap-4">
                      <div className="font-black text-lg uppercase tracking-wider bg-gray-800 text-white w-full text-center py-2 rounded">
                        Agency Resolution Reports
                      </div>

                      {/* MEDICAL EVIDENCE */}
                      <div className="p-4 border-2 border-[#16A34A] bg-green-50 rounded shadow-sm">
                        <h3 className="font-black text-[#16A34A] mb-2 uppercase flex items-center gap-2">
                          🚑 Medical Dept
                        </h3>
                        {(selectedReport.medicalClosingNotes || selectedReport.medicalClosingImageBase64 || (selectedReport.closingNotes && selectedReport.requestedRole?.toUpperCase().includes('MEDICAL'))) ? (
                          <>
                            {(selectedReport.medicalClosingNotes || selectedReport.closingNotes) && (
                              <p className="text-gray-800 mb-3 text-sm font-semibold">
                                <span className="font-black text-green-900">Notes:</span> {selectedReport.medicalClosingNotes || selectedReport.closingNotes}
                              </p>
                            )}
                            {(selectedReport.medicalClosingImageBase64 || selectedReport.closingImageBase64) && (
                              <img 
                                src={`data:image/jpeg;base64,${selectedReport.medicalClosingImageBase64 || selectedReport.closingImageBase64}`} 
                                alt="Medical Evidence" 
                                className="w-full h-48 object-cover rounded border-2 border-green-300"
                              />
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500 text-sm font-bold italic">No resolution evidence submitted yet.</p>
                        )}
                      </div>

                      {/* FIRE EVIDENCE */}
                      <div className="p-4 border-2 border-red-600 bg-red-50 rounded shadow-sm">
                        <h3 className="font-black text-red-700 mb-2 uppercase flex items-center gap-2">
                          🚒 Fire Dept
                        </h3>
                        {(selectedReport.fireClosingNotes || selectedReport.fireClosingImageBase64 || (selectedReport.closingNotes && selectedReport.requestedRole?.toUpperCase().includes('FIRE'))) ? (
                          <>
                            {(selectedReport.fireClosingNotes || selectedReport.closingNotes) && (
                              <p className="text-gray-800 mb-3 text-sm font-semibold">
                                <span className="font-black text-red-900">Notes:</span> {selectedReport.fireClosingNotes || selectedReport.closingNotes}
                              </p>
                            )}
                            {(selectedReport.fireClosingImageBase64 || selectedReport.closingImageBase64) && (
                              <img 
                                src={`data:image/jpeg;base64,${selectedReport.fireClosingImageBase64 || selectedReport.closingImageBase64}`} 
                                alt="Fire Evidence" 
                                className="w-full h-48 object-cover rounded border-2 border-red-300"
                              />
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500 text-sm font-bold italic">No resolution evidence submitted yet.</p>
                        )}
                      </div>

                      {/* POLICE EVIDENCE */}
                      <div className="p-4 border-2 border-blue-600 bg-blue-50 rounded shadow-sm">
                        <h3 className="font-black text-blue-700 mb-2 uppercase flex items-center gap-2">
                          🚓 Police Dept
                        </h3>
                        {(selectedReport.policeClosingNotes || selectedReport.policeClosingImageBase64 || (selectedReport.closingNotes && selectedReport.requestedRole?.toUpperCase().includes('POLICE'))) ? (
                          <>
                            {(selectedReport.policeClosingNotes || selectedReport.closingNotes) && (
                              <p className="text-gray-800 mb-3 text-sm font-semibold">
                                <span className="font-black text-blue-900">Notes:</span> {selectedReport.policeClosingNotes || selectedReport.closingNotes}
                              </p>
                            )}
                            {(selectedReport.policeClosingImageBase64 || selectedReport.closingImageBase64) && (
                              <img 
                                src={`data:image/jpeg;base64,${selectedReport.policeClosingImageBase64 || selectedReport.closingImageBase64}`} 
                                alt="Police Evidence" 
                                className="w-full h-48 object-cover rounded border-2 border-blue-300"
                              />
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500 text-sm font-bold italic">No resolution evidence submitted yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ==================== EXCLUSIVE HIGH-QUALITY PRINT LAYOUT (Only visible on print) ==================== */}
      <div className="hidden print:block bg-white text-black p-6 w-full">
        {reports
          .filter((r) => checkedReportIds.includes(r.id))
          .map((report, idx) => {
            const reportStatus = report.medicalStatus || report.status || 'PENDING';
            return (
              <div key={report.id} className="break-page mb-8 border-b-2 border-gray-400 pb-8 last:border-b-0 last:mb-0">
                
                {/* Dossier Document Header */}
                <div className="flex justify-between items-end border-b-4 border-green-600 pb-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-black uppercase text-gray-900 tracking-tight">🚨 Incident History Dossier</h1>
                    <p className="text-xs font-bold text-gray-500 uppercase">Emergency Dispatch Command Center Archive</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-700">Page {idx + 1} of {checkedReportIds.length}</p>
                    <p className="text-xs text-gray-500 font-semibold">Generated: {new Date().toLocaleString()}</p>
                  </div>
                </div>

                {/* Grid 1: Basic Report Details */}
                <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-300 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Incident Category</span>
                    <strong className="text-sm font-extrabold text-gray-900">{report.incidentTitle || 'MEDICAL REPORT'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Archived ID</span>
                    <span className="text-xs font-mono block truncate">{report.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Reported Timestamp</span>
                    <strong className="text-sm font-bold text-gray-800">{formatDateTime(report.createdAt)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Severity Classification</span>
                    <strong className={`text-sm font-black ${report.severity === 'CRITICAL' ? 'text-red-700' : 'text-orange-600'}`}>
                      ⚠️ {report.severity || 'HIGH'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Final Status</span>
                    <strong className="text-sm font-black text-green-700">{reportStatus}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Agency Type</span>
                    <strong className="text-sm font-black text-blue-700">MEDICAL DEPARTMENT</strong>
                  </div>
                  <div className="col-span-3 border-t border-gray-200 pt-2 mt-1">
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Incident Location</span>
                    <strong className="text-sm font-extrabold text-gray-900">📍 {report.location || report.address || 'Unknown Address'}</strong>
                  </div>
                </div>

                {/* Grid 2: Citizen Reporting & Valid ID Side-by-Side */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Reporter details */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-white flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-xs uppercase text-gray-700 border-b pb-1.5 mb-2.5">Reporter Authentication</h3>
                      <p className="text-xs mb-1">
                        <span className="font-extrabold text-gray-600">Identity:</span>{' '}
                        {report.isAnonymous ? '🕵️ Declared Anonymous Citizen' : (report.reporterName || 'Unknown')}
                      </p>
                      <p className="text-xs mb-3">
                        <span className="font-extrabold text-gray-600">Registered Email:</span>{' '}
                        {report.isAnonymous ? `Hidden (Audited: ${report.actualReporterEmail})` : (report.email || 'N/A')}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase text-gray-500 mb-1">Citizen Emergency Description:</h4>
                      <p className="text-xs italic text-gray-700 bg-gray-50 p-2.5 rounded border border-dashed border-gray-300">
                        "{report.description || 'No description provided by citizen.'}"
                      </p>
                    </div>
                  </div>

                  {/* Valid ID Attached */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-white flex flex-col items-center justify-center">
                    <h3 className="font-black text-xs uppercase text-gray-700 border-b w-full pb-1.5 mb-2 text-center">
                      Government-Issued Verified Identification
                    </h3>
                    {report.idImageBase64 ? (
                      <img 
                        src={`data:image/jpeg;base64,${report.idImageBase64}`} 
                        alt="Citizen ID proof" 
                        className="h-28 w-auto object-contain rounded border border-gray-300 shadow-sm mt-1 max-w-full" 
                      />
                    ) : (
                      <div className="h-28 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded text-xs text-gray-400 font-bold uppercase">
                        No ID Document Uploaded
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Evidence Images */}
                <div className="mb-6">
                  <h3 className="font-black text-xs uppercase text-gray-700 border-b pb-1.5 mb-3">
                    Incident Evidence Verification Photos
                  </h3>
                  {report.anglesBase64 && typeof report.anglesBase64 === 'object' ? (
                    <div className="grid grid-cols-4 gap-4">
                      {['North', 'East', 'West', 'South'].map((direction) => {
                        const base64 = report.anglesBase64[direction];
                        return (
                          <div key={direction} className="border border-gray-200 rounded-lg p-2 bg-gray-50 flex flex-col items-center">
                            {base64 ? (
                              <img 
                                src={`data:image/jpeg;base64,${base64}`} 
                                alt={`${direction} verification angle`} 
                                className="h-28 w-full object-cover rounded shadow-sm" 
                              />
                            ) : (
                              <div className="h-28 w-full flex items-center justify-center bg-gray-200 rounded text-[10px] text-gray-400 font-bold uppercase">
                                Empty
                              </div>
                            )}
                            <span className="text-[10px] font-black text-gray-600 mt-1 uppercase tracking-wide">🧭 {direction}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : report.imageBase64 ? (
                    <div className="flex justify-center">
                      <div className="border p-2 rounded bg-gray-50">
                        <img 
                          src={`data:image/jpeg;base64,${report.imageBase64}`} 
                          alt="Incident Single Evidence" 
                          className="h-44 object-cover rounded border" 
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic text-center p-4 bg-gray-50 rounded border">No visual evidence uploaded for this incident.</p>
                  )}
                </div>

                {/* Section 4: Resolution Information */}
                <div>
                  <h3 className="font-black text-xs uppercase text-gray-700 border-b pb-1.5 mb-3">
                    Department Resolution Records
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    
                    {/* Medical Dept Closing details */}
                    <div className="border border-green-300 bg-green-50/20 rounded-lg p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-xs text-green-700 uppercase mb-1.5">🚑 Medical Dept</h4>
                        <p className="text-[11px] text-gray-700 leading-normal italic mb-3">
                          {report.medicalClosingNotes || report.closingNotes || "No incident closure details recorded."}
                        </p>
                      </div>
                      {report.medicalClosingImageBase64 || (report.closingImageBase64 && report.requestedRole?.toUpperCase().includes('MEDICAL')) ? (
                        <img 
                          src={`data:image/jpeg;base64,${report.medicalClosingImageBase64 || report.closingImageBase64}`} 
                          className="h-24 w-full object-cover rounded border border-green-200 shadow-sm" 
                        />
                      ) : null}
                    </div>

                    {/* Fire Dept Closing details */}
                    <div className="border border-red-300 bg-red-50/20 rounded-lg p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-xs text-red-700 uppercase mb-1.5">🚒 Fire Dept</h4>
                        <p className="text-[11px] text-gray-700 leading-normal italic mb-3">
                          {report.fireClosingNotes || "No incident closure details recorded."}
                        </p>
                      </div>
                      {report.fireClosingImageBase64 ? (
                        <img 
                          src={`data:image/jpeg;base64,${report.fireClosingImageBase64}`} 
                          className="h-24 w-full object-cover rounded border border-red-200 shadow-sm" 
                        />
                      ) : null}
                    </div>

                    {/* Police Dept Closing details */}
                    <div className="border border-blue-300 bg-blue-50/20 rounded-lg p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-xs text-blue-700 uppercase mb-1.5">🚓 Police Dept</h4>
                        <p className="text-[11px] text-gray-700 leading-normal italic mb-3">
                          {report.policeClosingNotes || "No incident closure details recorded."}
                        </p>
                      </div>
                      {report.policeClosingImageBase64 ? (
                        <img 
                          src={`data:image/jpeg;base64,${report.policeClosingImageBase64}`} 
                          className="h-24 w-full object-cover rounded border border-blue-200 shadow-sm" 
                        />
                      ) : null}
                    </div>

                  </div>
                </div>

{/* Audit Seal Footer */}
                <div className="mt-8 pt-4 border-t border-dashed border-gray-300 flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase">
                  <span>Authorized Personnel Audit Slip</span>
                  <span>Signature Verified Electronically</span>
                  <span>CONFIDENTIAL - INTERNAL COMMAND CENTER USE ONLY</span>
                </div>

              </div>
            );
          })}
      </div> 
      {/* ⬆️ THIS </div> CLOSES THE PRINT CONTAINER (hidden print:block) */}

{/* ========================================================= */}
        {/* 📖 PLACE THE MODAL HERE (Outside the print container)     */}
        {/* ========================================================= */}
<InstructionManualModal 
  isOpen={isManualOpen} 
  onClose={() => setIsManualOpen(false)} 
  department="health" 
/>

        <EulaModal
  isOpen={isEulaOpen}
  onClose={() => setIsEulaOpen(false)}
/>

        {/* 🚨 INCOMING EMERGENCY REPORT ALARM MODAL */}
        <IncomingReportModal 
          isOpen={isAlarmOpen}
          onClose={() => setIsAlarmOpen(false)}
          reportData={incomingReport}
          departmentName="MEDICAL"
        />

    </>
  );
}

export default MedicalDashboard;