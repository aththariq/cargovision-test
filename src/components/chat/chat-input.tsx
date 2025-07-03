import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Paperclip, Mic } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  placeholder = "Tanyakan tentang compliance, regulasi, atau inspeksi container...",
  disabled = false,
  isLoading = false,
  maxLength = 1000,
  className
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmedMessage = message.trim();
  const canSend = trimmedMessage.length > 0 && !disabled && !isLoading;
  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSend) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative flex items-end gap-2 p-4 border rounded-lg bg-background transition-colors",
          isFocused ? "border-primary ring-1 ring-primary" : "border-border",
          disabled && "opacity-50"
        )}>
          {/* Attachment Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-2 h-8 w-8 shrink-0"
                  disabled={disabled}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lampirkan file</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Text Input */}
          <div className="flex-1 min-w-0">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "min-h-[40px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 py-2",
                "placeholder:text-muted-foreground/70"
              )}
              rows={1}
            />
            
            {/* Character Counter */}
            {isNearLimit && (
              <div className={cn(
                "text-xs mt-1",
                characterCount >= maxLength ? "text-destructive" : "text-muted-foreground"
              )}>
                {characterCount}/{maxLength}
              </div>
            )}
          </div>

          {/* Voice Input Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-2 h-8 w-8 shrink-0"
                  disabled={disabled}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voice input</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Send Button */}
          <Button
            type="submit"
            size="sm"
            disabled={!canSend}
            className="h-8 px-3 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick Suggestions */}
        {!message && !disabled && (
          <div className="flex flex-wrap gap-1 mt-2">
            {[
              "Apa regulasi terbaru untuk inspeksi container?",
              "Bagaimana cara menangani anomali terdeteksi?",
              "Prosedur untuk container high-risk?"
            ].map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage(suggestion)}
                className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </form>

      {/* Loading indicator when bot is typing */}
      {isLoading && (
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          AI Assistant sedang mengetik...
        </div>
      )}
    </div>
  );
} 