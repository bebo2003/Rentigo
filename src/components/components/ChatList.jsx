import React, { useEffect, useState } from 'react';
import { getConversations } from './services/chatAPI';
import { MessageCircle } from 'lucide-react'; // أيقونة chat

export default function ChatList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
        Chat Conversations
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <p className="text-center text-gray-500 italic">No conversations found.</p>
      ) : (
        conversations.map((conv) => {
          const lastMessage = conv.messages?.length
            ? conv.messages[conv.messages.length - 1].message_content
            : 'No messages yet';

          return (
            <div
              key={conv.id}
              className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm cursor-pointer 
                         hover:shadow-md transition transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="text-purple-500 dark:text-purple-400 w-6 h-6" />
                <h3 className="text-xl font-semibold truncate">{conv.item.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Lender: <span className="font-medium">{conv.lender.first_name} {conv.lender.last_name}</span>
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-200 italic truncate">
                {lastMessage}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
