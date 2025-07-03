import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChatMessage as ChatMessageType } from './chat-message';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { ArrowDown, RefreshCw, Trash2 } from 'lucide-react';

interface ChatContainerProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  onClearHistory?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
  showWelcome?: boolean;
  title?: string;
}

export function ChatContainer({
  messages,
  onSendMessage,
  onClearHistory,
  onRefresh,
  isLoading = false,
  className,
  showWelcome = true,
  title = "AI Compliance Assistant"
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Auto-scroll to bottom when new messages arrive (if user isn't manually scrolling)
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [messages, isUserScrolling]);

  // Monitor scroll position to show/hide scroll button
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      setShowScrollButton(!isNearBottom && messages.length > 3);
      setIsUserScrolling(!isNearBottom);
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto' 
    });
  };

  const handleScrollToBottom = () => {
    scrollToBottom();
    setIsUserScrolling(false);
  };

  const WelcomeMessage = () => (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.707-.424l-3.677.925.925-3.677A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Selamat datang! Saya siap membantu Anda dengan pertanyaan seputar compliance, 
        regulasi, dan inspeksi container. Apa yang ingin Anda ketahui?
      </p>
      <div className="grid gap-2 w-full max-w-md">
        {[
          "Apa saja dokumen yang diperlukan untuk inspeksi?",
          "Bagaimana menangani container dengan anomali?",
          "Prosedur compliance untuk ekspor-impor?"
        ].map((question, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSendMessage(question)}
            className="justify-start text-left h-auto p-3 whitespace-normal"
            disabled={isLoading}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          )}
          {onClearHistory && messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              disabled={isLoading}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 relative">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-4">
            {messages.length === 0 && showWelcome ? (
              <WelcomeMessage />
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <Button
            onClick={handleScrollToBottom}
            size="sm"
            className="absolute bottom-4 right-4 rounded-full shadow-lg h-10 w-10 p-0"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </div>
  );
} 