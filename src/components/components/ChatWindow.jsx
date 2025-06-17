import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getMessages, sendMessage } from '../services/chatAPI';

export default function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const data = await getMessages(conversation.id, token);
      setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
  }, [conversation, token]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    await sendMessage(conversation.id, newMsg, token);
    setNewMsg('');
    const updated = await getMessages(conversation.id, token);
    setMessages(updated || []);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md">

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-gray-400 text-center">جاري تحميل الرسائل...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-center">لا توجد رسائل بعد.</p>
        ) : (
          messages.map((msg) => {
            const isLenderMsg = msg.sender === 'lender';
            return (
              <div
                key={msg.id}
                className={`flex ${isLenderMsg ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[70%] shadow-md ${
                    isLenderMsg
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-br-none'
                      : 'bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-bl-none'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">
                    {isLenderMsg
                      ? `${conversation.lender?.first_name} ${conversation.lender?.last_name}`
                      : `${conversation.customer?.first_name} ${conversation.customer?.last_name}`}
                  </div>
                  <p className="break-words">{msg.message_content}</p>
                  <div className="text-xs text-gray-200 mt-1 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t bg-gray-100 dark:bg-gray-800 flex items-center gap-2 rounded-b-xl">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="اكتب رسالة..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full p-2 px-4 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-500 transition"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}

ChatWindow.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    customer: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
    lender: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
  }).isRequired,
};
