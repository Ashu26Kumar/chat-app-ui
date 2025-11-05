import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import getApiConfig from "./config/config";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const messagesEndRef = useRef(null);

  // Mock API function - replace with your actual API endpoint
  const apiCall = async (message) => {
    try {
      const api = getApiConfig();
      console.log(api)
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }
      if(!api.includes("reset")){ const data = await response.json();
      return data.reply;
      } 
      else{
        return true;
      }
        // Adjust based on your API response structure
    } catch (error) {
      throw new Error('Failed to get response from API');
    }
  };

   const apiResetCall = async (message) => {
    try {
      const api = getApiConfig();
      console.log(api)
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }
      return true;
        // Adjust based on your API response structure
    } catch (error) {
      throw new Error('Failed to get response from API');
    }
  };
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    console.log(inputMessage)
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setConnectionStatus('connecting');

    try {
      setConnectionStatus('connected');

      // Replace this with your actual API call
      const response = await apiCall(inputMessage);

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    
    const isContextCleared = await apiResetCall()
    if(isContextCleared){
      setMessages([]);
      setConnectionStatus('connected');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setInputMessage(e.target.value);

    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h1>Chat Assistant</h1>
        <div className="header-controls">
          <div className={`status ${connectionStatus}`}>
            {connectionStatus === 'connected' && 'Online'}
            {connectionStatus === 'connecting' && 'Connecting...'}
            {connectionStatus === 'disconnected' && 'Offline'}
            {connectionStatus === 'error' && 'Error'}
          </div>
          <button
            className="reset-btn"
            onClick={handleReset}
            disabled={messages.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="welcome-message">
                <h3>Welcome to Chat Assistant</h3>
                <p>Start a conversation by typing a message below.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-timestamp">{message.timestamp}</div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
            >
              Send
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatApp;