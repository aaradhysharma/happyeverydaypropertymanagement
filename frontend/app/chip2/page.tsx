"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Send, 
  Loader2, 
  MessageCircle, 
  Calendar, 
  Pill, 
  Activity,
  Phone,
  User,
  Bot,
  Sparkles,
  Shield,
  Clock,
  Stethoscope,
  ArrowLeft,
  RefreshCw,
  Menu,
  X
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { icon: Calendar, label: "Schedule Appointment", prompt: "How do I schedule an appointment with my ChenMed doctor?" },
  { icon: Pill, label: "Medication Help", prompt: "Can you help me understand my medications better?" },
  { icon: Activity, label: "Wellness Tips", prompt: "What are some daily wellness tips for seniors?" },
  { icon: Heart, label: "Heart Health", prompt: "What should I know about maintaining heart health?" },
  { icon: Shield, label: "Preventive Care", prompt: "What preventive screenings should I have at my age?" },
  { icon: Stethoscope, label: "Symptoms Guide", prompt: "What symptoms should I never ignore?" },
];

export default function Chip2Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm **CHIP2**, your ChenMed Healthcare Intelligence Assistant. 👋\n\nI'm here to help you with:\n\n• **Health questions** - Understanding conditions and treatments\n• **Appointment guidance** - When to see your doctor\n• **Wellness tips** - Staying healthy every day\n• **Medication help** - Managing your prescriptions\n\nHow can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chip2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I apologize, but I encountered an issue: ${data.error}. Please try again or contact ChenMed support if the problem persists.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection or try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hello! I'm **CHIP2**, your ChenMed Healthcare Intelligence Assistant. 👋\n\nI'm here to help you with:\n\n• **Health questions** - Understanding conditions and treatments\n• **Appointment guidance** - When to see your doctor\n• **Wellness tips** - Staying healthy every day\n• **Medication help** - Managing your prescriptions\n\nHow can I assist you today?",
      timestamp: new Date()
    }]);
    setInput("");
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '<span class="text-primary">•</span>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">CHIP2</h1>
                <p className="text-sm text-white/80 hidden sm:block">ChenMed Healthcare Intelligence Platform</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={startNewChat}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-72 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto`}>
          <div className="p-4 space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSend(action.prompt);
                      setShowSidebar(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 text-left transition group"
                  >
                    <div className="p-2 rounded-lg bg-teal-100 text-teal-600 group-hover:bg-teal-200 transition">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Notice */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800 text-sm">Emergency?</p>
                    <p className="text-xs text-red-700 mt-1">Call 911 immediately for life-threatening emergencies.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ChenMed Info */}
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Stethoscope className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-teal-800 text-sm">About ChenMed</p>
                    <p className="text-xs text-teal-700 mt-1">
                      Providing value-based primary care to seniors since 1985. Your health, our priority.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/30 z-30"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] lg:max-w-[60%] rounded-2xl px-5 py-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                  }`}
                >
                  <div 
                    className={`text-base leading-relaxed ${message.role === 'assistant' ? 'prose prose-sm max-w-none' : ''}`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    <Clock className="h-3 w-3 inline mr-1" />
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-md">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-5 py-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-teal-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">CHIP2 is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your health question here..."
                    rows={2}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 pr-12 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 bottom-3 p-2 rounded-lg bg-gradient-to-r from-teal-600 to-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                CHIP2 provides health information, not medical advice. Always consult your ChenMed physician.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Version Badge */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full shadow-sm">
        v0.0.1
      </div>
    </div>
  );
}
