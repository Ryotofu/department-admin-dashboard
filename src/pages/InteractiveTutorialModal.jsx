import React, { useState } from 'react';

export default function InteractiveTutorialModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Command Center",
      badge: "Step 1 of 5",
      icon: "🚨",
      content: "This terminal handles live citizen emergency streams, real-time spatial evidence, multi-agency dispatches, and archived report auditing.",
    },
    {
      title: "Live Incident Feed Sidebar",
      badge: "Step 2 of 5",
      icon: "📋",
      content: "The left panel streams incoming calls in real-time. Use the 'SWITCH TO HISTORY' button to pivot between live operations and closed case records.",
    },
    {
      title: "Detail Inspection & Verification",
      badge: "Step 3 of 5",
      icon: "🔍",
      content: "Clicking a report displays precise GPS coordinates, citizen descriptions, government ID documents, and 4-angle directional photos (North, East, West, South).",
    },
    {
      title: "Multi-Agency Dispatching",
      badge: "Step 4 of 5",
      icon: "📻",
      content: "Update unit status independently. Changing Fire Department status won't conflict with Police or Medical status updates on multi-agency incidents.",
    },
    {
      title: "Case Closure & Dossier Print",
      badge: "Step 5 of 5",
      icon: "🖨️",
      content: "Upload on-scene photos and notes to close cases. Check archived reports in History mode to output formatted PDF/Print Dossiers.",
    },
  ];

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 transform transition-all">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2">
          <div 
            className="bg-yellow-400 h-2 transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          />
        </div>

        {/* Step Header */}
        <div className="p-6 pb-2 flex justify-between items-start">
          <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            {step.badge}
          </span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-4 text-center">
          <div className="w-16 h-16 bg-red-50 text-3xl rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            {step.icon}
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">{step.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed min-h-[60px]">
            {step.content}
          </p>
        </div>

        {/* Step Controls */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              currentStep === 0 
                ? 'opacity-30 cursor-not-allowed text-gray-400' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            ← Previous
          </button>

          <div className="flex gap-1">
            {tutorialSteps.map((_, i) => (
              <span 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? 'bg-red-600 w-4' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-md transition"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finish Tutorial 🎉' : 'Next Step →'}
          </button>
        </div>
      </div>
    </div>
  );
}