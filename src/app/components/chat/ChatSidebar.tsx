
'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  timestamp: number;
  symbol: string;
}

interface ChatSidebarProps {
  symbol: string;
}

export default function ChatSidebar({ symbol }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 닉네임 생성
  useEffect(() => {
    if (!nickname) {
      const randomId = Math.floor(Math.random() * 10000);
      setNickname(`익명${randomId}`);
    }
  }, [nickname]);

  // 소켓 연결
  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    socketRef.current.on('roomJoined', (data) => {
      setMessages(data.messages || []);
    });

    socketRef.current.on('newMessage', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('userJoined', (data) => {
      const joinMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        nickname: '시스템',
        message: `${data.nickname}님이 입장했습니다.`,
        timestamp: data.timestamp,
        symbol,
      };
      setMessages(prev => [...prev, joinMessage]);
    });

    socketRef.current.on('userTyping', (data) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [symbol]);

  // 채팅방 참가
  useEffect(() => {
    if (socketRef.current && isConnected && nickname) {
      socketRef.current.emit('joinRoom', { symbol, nickname });
    }
  }, [symbol, isConnected, nickname]);

  // 메시지 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('sendMessage', {
      message: newMessage.trim(),
      symbol,
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (socketRef.current) {
      socketRef.current.emit('typing', {
        symbol,
        isTyping: e.target.value.length > 0,
      });
    }
  };

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        💬
      </button>

      {/* 사이드바 */}
      <aside className={`
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        fixed lg:relative right-0 top-0 h-full
        w-full sm:w-80 lg:w-96
        bg-gray-900/95 backdrop-blur-sm border-l border-gray-800
        transition-transform duration-300 z-40
        flex flex-col
      `}>
        <div className="p-4 lg:p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{symbol} 채팅방</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {isConnected ? '연결됨' : '연결 중...'}
          </div>
        </div>
        
        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-400">
                  {message.nickname}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-gray-300 mt-1">
                {message.message}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-xs text-gray-500 italic">
              누군가 입력 중...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !newMessage.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm font-medium transition-colors"
            >
              전송
            </button>
          </div>
        </div>
      </aside>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
