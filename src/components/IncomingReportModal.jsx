import { useEffect } from 'react';

function IncomingReportModal({ isOpen, onClose, reportData, departmentName = "EMERGENCY" }) {
  useEffect(() => {
    if (!isOpen) return;

    // Load and loop your audio file from public/alarm.mp3
    const alarmAudio = new Audio('/alarm.mp3');
    alarmAudio.loop = true;

    // Play the alarm sound
    alarmAudio.play().catch((err) => {
      console.error("Audio playback error (check browser autoplay permissions):", err);
    });

    // Stop and reset audio when modal closes
    return () => {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white border-4 border-red-600 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-center">
        
        <div className="bg-red-600 text-white p-6 flex flex-col items-center justify-center gap-2">
          <span className="text-6xl animate-bounce">🚨</span>
          <h2 className="text-2xl font-black tracking-widest uppercase">
            INCOMING {departmentName} REPORT
          </h2>
          <p className="text-xs font-bold text-red-100 uppercase tracking-wider">
            Immediate Dispatch Action Required
          </p>
        </div>

        <div className="p-6 space-y-4 bg-gray-50 text-left">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-2">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Incident Title</span>
              <p className="text-lg font-black text-gray-800 uppercase">
                {reportData?.incidentTitle || 'UNCLASSIFIED EMERGENCY'}
              </p>
            </div>
            
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Location</span>
              <p className="text-sm font-bold text-gray-700">
                📍 {reportData?.location || reportData?.address || 'Location Unspecified'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Severity Level</span>
              <span className="inline-block bg-red-100 text-red-800 text-xs font-black px-2.5 py-1 rounded mt-0.5">
                ⚠️ {reportData?.severity || 'HIGH'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-black py-4 px-6 rounded-xl shadow-lg transition-all uppercase tracking-wider cursor-pointer active:scale-95"
          >
            🔕 ACKNOWLEDGE & CLOSE ALARM
          </button>
        </div>

      </div>
    </div>
  );
}

export default IncomingReportModal;