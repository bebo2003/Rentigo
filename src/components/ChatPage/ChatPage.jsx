import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConversations, getMessages, sendMessage } from '../services/chatAPI';
import { toast } from 'react-toastify';
import { Menu } from 'lucide-react';

const ChatPage = () => {
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations(token);
        setConversations(data);
      } catch {
        toast.error("خطأ في تحميل المحادثات");
      }
    };
    fetchConversations();
  }, [token]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      setLoading(true);
      try {
        const msgs = await getMessages(conversationId, token);
        setMessages(msgs);
      } catch {
        toast.error("فشل في تحميل الرسائل");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId, token]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const messageToSend = newMessage;
    setNewMessage('');
    try {
      await sendMessage(conversationId, messageToSend, token);
      const msgs = await getMessages(conversationId, token);
      setMessages(msgs);
    } catch {
      toast.error("فشل في إرسال الرسالة");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white relative">

      {/* Sidebar */}
      <div className={`fixed md:relative top-0 left-0 h-full bg-gray-200 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-4 overflow-y-auto transition-transform z-10
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}>
        <h2 className="text-purple-500 font-bold mb-4 text-center">Conversations</h2>
        {conversations.map((conv) => {
          // تحديد آخر رسالة
          const lastMsg = conv.lastMessage ? conv.lastMessage : "Tab to start chatting";
          return (
            <Link
              key={conv.id}
              to={`/chatpage/${conv.id}`}
              className="block p-3 mb-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="font-semibold text-purple-400 truncate">
                {conv.lender.first_name} {conv.lender.last_name} - {conv.item.title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {lastMsg}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Chat Window */}
      <div className="flex-1 p-6 flex flex-col ml-0 md:ml-64 relative">

        {/* Toggle Sidebar Button */}
        <button
          className="md:hidden absolute top-4 left-4 bg-purple-500 p-2 rounded-full hover:bg-purple-600 z-20"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="text-white" />
        </button>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-inner mt-12 md:mt-0">
          {loading ? (
            <p>Messages are loading...</p>
          ) : messages.length === 0 ? (
            <p>No Messages...</p>
          ) : (
            messages.map((msg) => {
              const isLender = msg.sender === 'lender';
              const senderName = isLender
                ? `${conversations.find(conv => conv.id === parseInt(conversationId))?.lender.first_name} ${conversations.find(conv => conv.id === parseInt(conversationId))?.lender.last_name}`
                : `${conversations.find(conv => conv.id === parseInt(conversationId))?.customer.first_name} ${conversations.find(conv => conv.id === parseInt(conversationId))?.customer.last_name}`;

              return (
                <div
                  key={msg.id}
                  className={`mb-3 flex ${isLender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[70%] shadow-md ${
                      isLender
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-black rounded-br-none'
                        : 'bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-bl-none'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">
                      {senderName}
                    </span>
                    <p className="text-sm">{msg.message_content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Send Box */}
        {conversationId && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 rounded-xl border border-gray-300 dark:border-gray-700 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-yellow-400 text-black px-6 py-2 rounded-xl hover:bg-yellow-500 transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
