import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Mic, LifeBuoy, HelpCircle, CheckCircle2, MessageSquare, Plus, Clock, AlertCircle } from 'lucide-react';

interface Ticket {
  id: string;
  category: string;
  description: string;
  orderId?: string;
  status: string;
  createdAt: string;
  messages: Array<{ sender: string; content: string; time: string }>;
}

export const HelpDeskPage: React.FC = () => {
  const { user } = useAuth();
  const { speakText, isSimpleMode } = useLanguage();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('ORDER');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support/tickets');
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          orderId: orderId || undefined,
          userName: user?.name || 'Guest User',
          userRole: user?.role || 'CONSUMER'
        })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setShowModal(false);
        setDescription('');
        setOrderId('');
        fetchTickets();
        speakText('Your human support ticket has been created successfully. An agent will contact you shortly.');
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <LifeBuoy className="w-4 h-4 text-amber-600" /> KissanConnect Help Desk & Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How can we help you today?
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Get instant automated assistance from <strong>KissanConnect AI</strong> in 11+ Indian languages, or create a ticket for <strong>Human Support</strong>.
          </p>
        </div>

        {/* 3 Main Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4">
                🤖
              </div>
              <h3 className="text-xl font-bold">Ask KissanConnect AI</h3>
              <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                Instant answers to order tracking, crop prices, payment methods, and produce listing in any Indian language.
              </p>
            </div>
            <button
              onClick={() => speakText('Click the floating AI button on the bottom right to start voice or text chat with KissanConnect AI.')}
              className="mt-6 w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-3 rounded-2xl shadow-md transition"
            >
              START AI CHAT ✨
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center text-2xl mb-4">
                🎙️
              </div>
              <h3 className="text-xl font-black">Multilingual Voice Help</h3>
              <p className="text-xs text-slate-900 mt-2 leading-relaxed">
                Speak directly in Hindi, Telugu, Tamil, Marathi, or English. Ideal for low-literacy users and quick answers.
              </p>
            </div>
            <button
              onClick={() => speakText('Voice assistance is enabled. Simply tap the microphone icon on any page to speak.')}
              className="mt-6 w-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-2xl shadow-md transition"
            >
              TALK TO KISSANCONNECT 🎙️
            </button>
          </div>

          <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl text-indigo-600 mb-4">
                💬
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Human Support Agent</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Need human assistance for payment issues, wrong delivery, or seller verification? Open a ticket below.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> CREATE SUPPORT TICKET
            </button>
          </div>
        </div>

        {/* Visual FAQs Section */}
        <div className="mb-14">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600" /> Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: '🚚 How do I track my order live?',
                a: 'Go to "Orders" → Click "Track Live" on your order card. You will see a 5-step animated telemetry route map showing distance and driver location.'
              },
              {
                q: '🌾 How do farmers get paid on KissanConnect?',
                a: 'Payments are processed directly via UPI / Net Banking upon order confirmation and credited to the farmer account within 24 hours.'
              },
              {
                q: '🥦 What if the received produce is not fresh?',
                a: 'You can submit a review and create a Human Support ticket within 12 hours of delivery for immediate refund or replacement.'
              },
              {
                q: '📦 How to buy in bulk for FPOs or restaurants?',
                a: 'Visit the "Bulk Requests" section to post your required quantity and budget. Verified farmers will submit competitive price bids directly.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-slate-900 text-base">{faq.q}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-indigo-600" /> Support Tickets
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              <Plus className="w-4 h-4" /> New Ticket
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <p className="font-semibold text-sm">No support tickets found.</p>
              <p className="text-xs text-slate-400 mt-1">If you have an issue, click "New Ticket" to contact support.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map(t => (
                <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-slate-900">{t.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                        t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {t.status}
                      </span>
                      <span className="text-xs text-slate-400">Category: {t.category}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-2">{t.description}</p>
                    {t.orderId && <p className="text-[11px] text-slate-400 mt-0.5">Order Ref: {t.orderId}</p>}
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Ticket Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-black text-slate-900 mb-4">Create Human Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="ORDER">Order & Tracking Issue</option>
                  <option value="PAYMENT">Payment & Refund</option>
                  <option value="PRODUCT">Produce Quality / Freshness</option>
                  <option value="FARMER">Farmer Listing Assistance</option>
                  <option value="OTHER">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Order Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. FC-9842"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description of Issue</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue clearly..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md"
                >
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
