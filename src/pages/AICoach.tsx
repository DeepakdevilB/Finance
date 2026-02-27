import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { explainFinancialStatus, suggestImprovementSteps, explainConceptInSimpleLanguage } from '../services/aiService';
import { Bot, Sparkles, Send, User as UserIcon } from 'lucide-react';

export default function AICoach() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data } = await supabase.from('users').select('*').eq('id', user?.id).single();
    if (data) {
      setProfile(data);
      // Initial greeting
      setMessages([
        { role: 'ai', text: `${t('hello')} ${data.name}! ${t('coach_welcome')}` },
        { role: 'ai', text: t('coach_subtitle') }
      ]);
    }
    setLoading(false);
  };

  const handleAction = async (action: 'status' | 'steps') => {
    if (!profile) return;
    setIsTyping(true);
    
    let response = '';
    const context = `Current Language: ${language === 'hi' ? 'Hindi' : 'English'}. Please respond in ${language === 'hi' ? 'Hindi' : 'English'}.`;
    
    if (action === 'status') {
      setMessages(prev => [...prev, { role: 'user', text: t('explain_status') }]);
      response = await explainFinancialStatus(profile, context);
    } else {
      setMessages(prev => [...prev, { role: 'user', text: t('suggest_improve') }]);
      response = await suggestImprovementSteps(profile, context);
    }

    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsTyping(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    const context = `Current Language: ${language === 'hi' ? 'Hindi' : 'English'}. Please respond in ${language === 'hi' ? 'Hindi' : 'English'}.`;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await explainConceptInSimpleLanguage(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsTyping(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">{t('loading')}</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-6rem)] max-w-4xl mx-auto">
      <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-sm mb-4 flex items-center gap-3 shrink-0">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg">{t('ai_coach')}</h2>
          <p className="text-emerald-100 text-xs">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide pb-2 text-slate-800">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70">
                {msg.role === 'user' ? <UserIcon size={12} /> : <Sparkles size={12} />}
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {msg.role === 'user' ? t('you') : t('ai_coach')}
                </span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => handleAction('status')}
            className="whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            {t('explain_status')}
          </button>
          <button 
            onClick={() => handleAction('steps')}
            className="whitespace-nowrap bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            {t('suggest_improve')}
          </button>
        </div>

        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ask_coach')}
            className="w-full bg-white border border-slate-200 rounded-full py-4 pl-6 pr-14 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
