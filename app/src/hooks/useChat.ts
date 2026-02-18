import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';
import { chatMessages as initialMessages } from '@/data/services';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages as ChatMessage[]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'Отлично! Я учел это в расчете. Есть ли еще какие-то особенности проекта?',
        'Понял! Давайте уточним еще несколько деталей для точного расчета.',
        'Отлично, записал. Какие сроки вы планируете для запуска проекта?',
        'Хорошо! У вас уже есть дизайн или нам нужно его разработать?',
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: randomResponse,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  return {
    messages,
    inputValue,
    isTyping,
    sendMessage,
    handleInputChange,
  };
}
