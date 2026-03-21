"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import axios from 'axios';

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hey! I\'m your LootBay assistant. Ask me anything about products or PC building! 🎮' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = async () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
        } catch (err: any) {
            const detail = err.response?.data?.details || err.message || 'Unknown error';
            setMessages(prev => [...prev, { role: 'bot', text: `⚠️ Error: ${detail}` }]);
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {open && (
                <div className="mb-4 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2 bg-neon-blue/10 border-b border-slate-700 px-4 py-3">
                        <Bot className="w-5 h-5 text-neon-blue" />
                        <span className="font-bold text-white text-sm">LootBay Assistant</span>
                        <button onClick={() => setOpen(false)} className="ml-auto text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${m.role === 'user' ? 'bg-neon-blue text-white' : 'bg-slate-800 text-slate-200'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="flex justify-start"><div className="bg-slate-800 px-3 py-2 rounded-xl"><Loader2 className="w-4 h-4 animate-spin text-neon-blue" /></div></div>}
                        <div ref={bottomRef} />
                    </div>
                    <div className="border-t border-slate-700 flex p-2 gap-2">
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                            placeholder="Ask me anything..." className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-slate-700 focus:border-neon-blue" />
                        <button onClick={send} className="p-2 bg-neon-blue rounded-lg text-white hover:opacity-80 transition-opacity"><Send className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
            <button onClick={() => setOpen(!open)} className="w-14 h-14 rounded-full bg-neon-blue text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
}
