import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ className, ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 
      text-gray-800 placeholder-gray-500 transition-all duration-200 ${className}`}
      {...props}
    />
  );
}

function ChatMessage({ role, content, isLatest }) {
  return (
    <div 
      className={`mb-4 ${role === 'user' ? 'text-right' : 'text-left'} 
      animate-fade-in-up`}
    >
      <div
        className={`inline-block max-w-[80%] p-3 rounded-2xl shadow-sm
        ${role === 'user'
          ? 'bg-violet-600 text-white from-violet-600 to-purple-600 bg-gradient-to-r'
          : 'bg-gray-100 text-gray-800'
        } ${isLatest ? 'animate-pop-in' : ''}`}
      >
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex space-x-1 p-2">
      <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
    </div>
  );
}

function ChatWindow({ messages, input, handleInputChange, handleSubmit, onClose, isTyping }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-96 h-[32rem] flex flex-col overflow-hidden border border-gray-100
      animate-slide-up backdrop-blur-sm bg-opacity-95">
      <div className="flex justify-between items-center p-4 border-b border-gray-100
        bg-gradient-to-r from-violet-500 to-purple-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center
            animate-glow">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">Chat Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="flex-grow overflow-auto p-4 bg-gradient-to-b from-white to-gray-50">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            role={message.role} 
            content={message.content}
            isLatest={index === messages.length - 1}
          />
        ))}
        {isTyping && <LoadingDots />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="shadow-sm hover:shadow-md transition-shadow duration-200"
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 
              hover:to-purple-700 shadow-sm hover:shadow-md transition-all duration-200 
              hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

const Chatbot = ({ statCardInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');  // Clear input field
    setIsTyping(true);

    try {
      console.log('Sending message:', input);
      console.log('Stat Card Info:', statCardInfo);  // Log stat card info before sending

      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, statCardInfo }),
      });

      const data = await response.json();
      console.log('Response from backend:', data);  // Log backend response

      setTimeout(() => {
        const botMessage = { role: 'bot', content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setIsTyping(false);
    }
  };

  const handleStatCardRequest = async () => {
    const statCardInfoData = {
      totalUsers: statCardInfo.totalUsers,
      activeErrors: statCardInfo.activeErrors,
      apiRequests: statCardInfo.apiRequests,
      databaseOps: statCardInfo.databaseOps,
    };
    

    const statMessage = "";

    // Log before sending the request to backend
    console.log('Stat Message:', statMessage);
    console.log('Stat Card Info:', statCardInfoData);

    const requestPayload = {
      message: statMessage,  // Send the stat message as the user query
      stat_card_info: {     
        [`totalUsers`]: statCardInfoData.totalUsers,  // Use computed property names
        [`activeErrors`]: statCardInfoData.activeErrors, 
        [`apiRequests`]: statCardInfoData.apiRequests, 
        [`databaseOps`]: statCardInfoData.databaseOps
      }
    };

    try { 
    // Log the request payload before sending the API call
    console.log('Sending stat request payload:', requestPayload);

    const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
    });

    // Log the full response from the backend
    const data = await response.json();
    console.log('Response from backend:', data);  // Log backend response
    
    // Log the specific part of the payload (stat_card_info) you're interested in
    console.log('statCardInfo:', requestPayload.stat_card_info);

    // Send the response back to the chat interface
    const statCardBotMessage = { role: 'bot', content: data.reply };
    setMessages((prev) => [...prev, statCardBotMessage]);
} catch (error) {
    // Log any errors that occur during the fetch process
    console.error('Error fetching AI response for stat card request:', error);
}

  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatRef}>
      {isOpen ? (
        <ChatWindow
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
          isTyping={isTyping}
        />
      ) : (
        <button
          className="rounded-full w-16 h-16 shadow-lg bg-gradient-to-r from-violet-600 to-purple-600 
            hover:from-violet-700 hover:to-purple-700 transition-all duration-300 
            flex items-center justify-center animate-bounce-subtle hover:scale-110 
            hover:shadow-violet-400/50 hover:shadow-xl"
          onClick={() => {
            setIsOpen(true);
            handleStatCardRequest();
          }}
        >
          <MessageCircle className="w-8 h-8 text-white animate-pulse" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;