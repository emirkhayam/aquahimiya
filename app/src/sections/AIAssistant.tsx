import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, inputValue, isTyping, sendMessage, handleInputChange } = useChat();

  // Auto-open chat after 5 seconds on first visit
  useEffect(() => {
    if (!hasOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasOpened(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasOpened]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#2563EB] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl animate-pulse-glow"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 w-full max-w-md transition-all duration-300',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10 pointer-events-none'
        )}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
          {/* Header */}
          <div className="gradient-hero px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI-ассистент</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Всегда на связи
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.sender === 'user' && 'flex-row-reverse'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.sender === 'ai'
                      ? 'bg-[#2563EB]'
                      : 'bg-[#E5E7EB]'
                  )}
                >
                  {message.sender === 'ai' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-[#6B7280]" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl p-3 text-sm',
                    message.sender === 'ai'
                      ? 'chat-bubble-ai text-[#1F2937]'
                      : 'chat-bubble-user text-[#1F2937]'
                  )}
                >
                  {message.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="chat-bubble-ai flex items-center gap-1 py-4 px-4">
                  <span
                    className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t border-[#E5E7EB]"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Опишите ваш проект..."
                className="flex-1 input-field"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-11 h-11 bg-[#2563EB] text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-2 text-center">
              AI поможет рассчитать стоимость вашего проекта
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
