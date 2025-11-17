import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';

interface Message {
  id: string | number;
  sender: string;
  senderRole?: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  title?: string;
  placeholder?: string;
  isCollapsible?: boolean;
  isFloating?: boolean;
  maxHeight?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  title = "Discussion",
  placeholder = "Écrivez votre message...",
  isCollapsible = false,
  isFloating = false,
  maxHeight = "400px"
}) => {
  const [message, setMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    if (messagesEndRef.current && !isCollapsed) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCollapsed]);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className={`flex flex-col rounded-lg shadow-lg overflow-hidden ${
      isFloating ? 'fixed bottom-4 right-4 w-80 z-50' : 'w-full h-full'
    } ${isCollapsed ? 'h-12' : 'h-full'}`}>
      {/* En-tête */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          <h3 className="font-medium">{title}</h3>
        </div>
        {isCollapsible && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:text-blue-200"
          >
            {isCollapsed ? <MessageSquare className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {!isCollapsed && (
        <>
          {/* Zone de messages */}
          <div 
            className="flex-1 p-3 overflow-y-auto"
            style={{ maxHeight }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 p-4">
                Aucun message pour le moment
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`max-w-[80%] ${msg.isCurrentUser ? 'ml-auto' : 'mr-auto'}`}
                  >
                    <div className={`p-3 rounded-lg ${
                      msg.isCurrentUser 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {!msg.isCurrentUser && (
                        <div className="font-medium text-sm mb-1">{msg.sender}</div>
                      )}
                      <p>{msg.content}</p>
                    </div>
                    <div className={`text-xs mt-1 text-gray-500 ${msg.isCurrentUser ? 'text-right' : ''}`}>
                      {msg.isCurrentUser ? 'Vous' : msg.sender} • {msg.timestamp}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Zone de saisie */}
          <div className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                placeholder={placeholder}
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;