import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminChatBox({ reportId, department, recipientEmail }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

// 💬 Real-time listener for report messages (All citizen & responder messages)
  useEffect(() => {
    if (!reportId) return;

    const messagesRef = collection(db, 'reports', reportId, 'messages');

    // Listens to all messages under this report without excluding citizen entries
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const fetchedMsgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Sort in-memory by timestamp safely (handles pending server timestamps)
      fetchedMsgs.sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
        return timeA - timeB;
      });

      setMessages(fetchedMsgs);
    });

    return () => unsubscribe();
  }, [reportId]);

  // 📜 Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 📤 Send message to Firestore
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !reportId) return;

    const msgText = text.trim();
    setText(''); // Instant UI input clear

    try {
      // 1. Add message document to subcollection
      await addDoc(collection(db, 'reports', reportId, 'messages'), {
        senderId: `${department.toLowerCase()}_admin`,
        senderEmail: `${department.toUpperCase()} Command Center`,
        senderRole: 'responder',
        department: department.toLowerCase(),
        text: msgText,
        timestamp: serverTimestamp(),
      });

      // 2. Update parent report document metadata
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
    <div className="bg-white border border-gray-300 rounded-lg shadow-md flex flex-col h-[360px] w-full mt-4">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-2.5 font-black text-xs uppercase tracking-wider flex justify-between items-center rounded-t-lg">
        <span className="flex items-center gap-2">💬 LIVE CITIZEN CHAT CHANNEL</span>
        <span className="text-[11px] text-gray-300 font-semibold truncate max-w-[200px]">
          👤 {recipientEmail || 'Citizen'}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <span className="text-3xl mb-1">💬</span>
            <p className="text-xs font-bold uppercase tracking-wider">No messages yet</p>
            <p className="text-[11px]">Inquire for additional details before dispatching team</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === 'responder' || msg.senderRole === 'admin';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-gray-500 font-bold mb-0.5 px-1">
                  {isMe ? `${department.toUpperCase()} Admin` : 'Citizen Reporter'}
                </span>
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
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
      <form onSubmit={handleSend} className="p-2 border-t border-gray-200 bg-white flex gap-2 rounded-b-lg">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
          placeholder={`Inquire citizen regarding this report...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}