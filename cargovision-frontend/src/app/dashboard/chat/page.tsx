"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Search,
  Settings,
  Paperclip,
  Image,
  FileText,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Trash2,
  AlertCircle,
  Container,
  BarChart3
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'image' | 'document' | 'container';
    name: string;
    url?: string;
    containerId?: string;
  }>;
  isTyping?: boolean;
  reactions?: Array<{
    type: 'like' | 'dislike';
    count: number;
  }>;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  type: 'ai' | 'team';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>('ai-assistant');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data for chat sessions
  useEffect(() => {
    const mockSessions: ChatSession[] = [
      {
        id: 'ai-assistant',
        title: 'AI Assistant',
        lastMessage: 'How can I help you analyze containers today?',
        timestamp: new Date(),
        unreadCount: 0,
        type: 'ai'
      },
      {
        id: 'team-general',
        title: 'General Team Chat',
        lastMessage: 'The new scanner is working great!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unreadCount: 3,
        type: 'team'
      },
      {
        id: 'inspection-alerts',
        title: 'Inspection Alerts',
        lastMessage: 'Container MSKU-1234567 flagged for review',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        unreadCount: 1,
        type: 'ai'
      }
    ];
    setChatSessions(mockSessions);
  }, []);

  // Mock initial messages for AI assistant
  useEffect(() => {
    if (selectedSession === 'ai-assistant') {
      const initialMessages: ChatMessage[] = [
        {
          id: '1',
          type: 'ai',
          content: "Hello! I'm your AI assistant for container inspection analysis. I can help you with:\n\n• Analyzing container inspection results\n• Explaining AI detection findings\n• Providing insights on inspection patterns\n• Generating custom reports\n\nWhat would you like to know?",
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          reactions: [{ type: 'like', count: 0 }]
        }
      ];
      setMessages(initialMessages);
    }
  }, [selectedSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        reactions: [{ type: 'like', count: 0 }]
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Mock AI responses based on keywords
    const input = userInput.toLowerCase();
    
    if (input.includes('container') && input.includes('flagged')) {
      return "I can help you analyze flagged containers. Here's what I found:\n\n🔍 **Recent Flagged Containers:**\n• MSKU-1234567 - 3 anomalies detected (92.5% confidence)\n• MSKU-2345678 - 2 security concerns (89.7% confidence)\n\n📊 **Analysis:**\n• Both containers show similar anomaly patterns\n• Recommend immediate physical inspection\n• Consider reviewing scanning parameters\n\nWould you like me to generate a detailed report for these containers?";
    }
    
    if (input.includes('report') || input.includes('generate')) {
      return "I can generate various types of reports for you:\n\n📄 **Available Reports:**\n• Container Inspection Summary\n• AI Performance Analysis\n• Anomaly Pattern Report\n• Inspector Performance Review\n• Location-based Statistics\n\n🎯 **Custom Reports:**\nI can also create custom reports based on specific criteria like date range, location, or inspector.\n\nWhich type of report would you like me to generate?";
    }
    
    if (input.includes('performance') || input.includes('statistics')) {
      return "Here are the current performance statistics:\n\n📈 **Today's Performance:**\n• Total Inspections: 47\n• Flagged Containers: 9 (19.1%)\n• Average AI Confidence: 93.2%\n• Processing Time: 2.4 minutes average\n\n🏆 **Top Performers:**\n• Best Inspector: Sarah Johnson (96.1% accuracy)\n• Most Efficient Location: Port of Medan\n• Highest Confidence Scans: 70.1% above 90%\n\nWould you like me to dive deeper into any specific metric?";
    }
    
    if (input.includes('help') || input.includes('how')) {
      return "I'm here to help! Here are some things I can assist you with:\n\n🔍 **Container Analysis:**\n• \"Show me flagged containers from today\"\n• \"Analyze container MSKU-1234567\"\n• \"What patterns do you see in recent inspections?\"\n\n📊 **Reports & Analytics:**\n• \"Generate inspection summary report\"\n• \"Show performance statistics\"\n• \"Compare this week vs last week\"\n\n⚙️ **System Insights:**\n• \"Explain AI detection confidence\"\n• \"How to improve inspection accuracy\"\n• \"What should I focus on today?\"\n\nJust ask me anything about container inspections!";
    }
    
    return "I understand you're asking about container inspections. While I can help with analysis, reporting, and insights, I'd need more specific information to provide the best assistance.\n\nCould you please clarify:\n• Are you looking for specific container information?\n• Do you need help with inspection results?\n• Would you like me to generate a report?\n• Are you seeking performance insights?\n\nI'm here to help make your container inspection process more efficient!";
  };

  const quickActions: QuickAction[] = [
    {
      id: 'today-flagged',
      title: 'Today\'s Flagged Containers',
      description: 'Show containers flagged today',
      icon: <AlertCircle className="h-4 w-4" />,
      action: () => setInputMessage('Show me all flagged containers from today')
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create inspection summary',
      icon: <FileText className="h-4 w-4" />,
      action: () => setInputMessage('Generate an inspection summary report for today')
    },
    {
      id: 'performance-stats',
      title: 'Performance Statistics',
      description: 'View current performance metrics',
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => setInputMessage('Show me current performance statistics')
    },
    {
      id: 'help',
      title: 'Help & Guide',
      description: 'Learn what I can help with',
      icon: <MessageCircle className="h-4 w-4" />,
      action: () => setInputMessage('How can you help me with container inspections?')
    }
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Sidebar - Chat Sessions */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chat Sessions</h2>
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 text-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedSession === session.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => setSelectedSession(session.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {session.type === 'ai' ? (
                    <Bot className="h-8 w-8 text-blue-500" />
                  ) : (
                    <User className="h-8 w-8 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{session.title}</p>
                    <p className="text-sm text-gray-500 truncate">{session.lastMessage}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">{formatDate(session.timestamp)}</span>
                  {session.unreadCount > 0 && (
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {session.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-500">Container Inspection Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Export Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Actions - Show only if no messages */}
          {messages.length <= 1 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Card
                    key={action.id}
                    className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={action.action}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-500">{action.icon}</div>
                      <div>
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-start gap-3">
                  {message.type !== 'user' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div
                      className={`p-4 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              {attachment.type === 'image' && <Image className="h-3 w-3" />}
                              {attachment.type === 'document' && <FileText className="h-3 w-3" />}
                              {attachment.type === 'container' && <Container className="h-3 w-3" />}
                              <span>{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="sm" className="mb-2">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder="Ask me about container inspections..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[44px] resize-none"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="mb-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 