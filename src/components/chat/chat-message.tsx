import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Check, Clock, AlertCircle } from 'lucide-react';

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  isTyping?: boolean;
}

interface ChatMessageProps {
  message: ChatMessage;
  className?: string;
}

const TypingIndicator = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
  </div>
);

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.type === 'user';
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="w-3 h-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%] group",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
        className
      )}
    >
      {/* Avatar */}
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarImage src={isUser ? undefined : "/bot-avatar.png"} />
        <AvatarFallback className={cn(
          "text-xs",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col gap-1",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <div
          className={cn(
            "relative px-4 py-2 rounded-lg max-w-md break-words",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-muted-foreground rounded-bl-sm",
            message.isTyping && "min-h-[2.5rem] flex items-center"
          )}
        >
          {message.isTyping ? (
            <TypingIndicator />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>

        {/* Timestamp and Status */}
        <div className={cn(
          "flex items-center gap-1 text-xs text-muted-foreground",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <time>{formatTime(message.timestamp)}</time>
          {isUser && getStatusIcon()}
        </div>

        {/* Bot Badge (only for bot messages) */}
        {!isUser && (
          <Badge variant="secondary" className="text-xs self-start">
            <Bot className="w-3 h-3 mr-1" />
            AI Assistant
          </Badge>
        )}
      </div>
    </div>
  );
} 