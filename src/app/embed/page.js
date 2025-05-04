'use client';
import { useState } from 'react';

export default function EmbedChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-full mx-auto bg-white">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-gray-900 ${
              message.role === 'user' 
                ? 'bg-blue-100 ml-auto max-w-[80%]' 
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={sendMessage} className="flex gap-2 p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg text-gray-900 bg-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}