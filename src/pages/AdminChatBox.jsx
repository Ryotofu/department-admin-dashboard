import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminChatBox({ reportId, department = 'general', recipientEmail }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Real-time listener for all report messages across citizens, admins, and responders
  useEffect(() => {
    if (!reportId) return;

    const messagesRef = collection(db, 'reports', reportId, 'messages');

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const fetchedMsgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Sort in-memory by timestamp safely (handles pending local server timestamps)
      fetchedMsgs.sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
        return timeA - timeB;
      });

      setMessages(fetchedMsgs);
    });

    return () => unsubscribe();
  }, [reportId]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format Firestore timestamp to 12-hour time string
  const formatTime = (ts) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to determine styling badge based on department/role
  const getBadgeStyle = (senderRole, msgDept) => {
    if (senderRole === 'citizen') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    
    switch (msgDept?.toLowerCase()) {
      case 'police':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fire':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'health':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  // Helper to render readable sender label
  const getSenderLabel = (msg) => {
    if (msg.senderRole === 'citizen') return 'Citizen Reporter';
    const deptUpper = (msg.department || 'COMMAND CENTER').toUpperCase();
    if (msg.senderRole === 'responder') return `${deptUpper} Field Unit`;
    return `${deptUpper} Command Center`;
  };

  // Send message to Firestore
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !reportId) return;

    const msgText = text.trim();
    setText(''); // Instant UI input clear

    try {
      // 1. Add message document to report messages subcollection
      await addDoc(collection(db, 'reports', reportId, 'messages'), {
        senderId: `${department.toLowerCase()}_admin`,
        senderEmail: `${department.toUpperCase()} Command Center`,
        senderRole: 'admin',
        department: department.toLowerCase(),
        text: msgText,
        timestamp: serverTimestamp(),
      });

      // 2. Update parent report metadata
      await updateDoc(doc(db, 'reports', reportId), {
        lastMessage: `[${department.toUpperCase()}] ${msgText}`,
        lastMessageTime: serverTimestamp(),
        hasUnreadCitizen: true,
        hasUnreadResponder: false,
      });
    } catch (err) {
      console.error("Error sending message from command center:", err);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md flex flex-col h-[420px] w-full mt-4">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 font-black text-xs uppercase tracking-wider flex justify-between items-center rounded-t-lg border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span>LIVE COMMAND CHANNEL</span>
        </div>
        <span className="text-[11px] text-gray-300 font-semibold truncate max-w-[220px]">
          Citizen: {recipientEmail || 'Anonymous'}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-1">
            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider">No communications recorded</p>
            <p className="text-[11px]">Send an inquiry below to message the citizen or assigned team.</p>
          </div>
        ) : (
          messages.map((msg) => {
            // Check if active department sent this message
            const isMe = msg.department === department.toLowerCase() && (msg.senderRole === 'admin' || msg.senderRole === 'responder');

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Identity & Role Badge */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${getBadgeStyle(msg.senderRole, msg.department)}`}>
                    {getSenderLabel(msg)}
                  </span>
                  {msg.timestamp && (
                    <span className="text-[10px] color-gray-400 font-medium">
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] px-3.5 py-2 rounded-xl text-xs font-semibold leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : msg.senderRole === 'citizen'
                      ? 'bg-gray-200 text-gray-900 rounded-tl-none border border-gray-300'
                      : 'bg-amber-100 text-amber-950 rounded-tl-none border border-amber-300'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-2.5 border-t border-gray-200 bg-white flex gap-2 rounded-b-lg">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          placeholder={`Broadcast as ${department.toUpperCase()} Command Center...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1"
        >
          <span>Send</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
}