import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Heart, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const GiveKudosModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [points, setPoints] = useState(20);
  const [message, setMessage] = useState('');
  const [selectedTags, setSelectedTags] = useState(['#Teamwork']);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchContainerRef = useRef(null);

  const availableTags = ['#Teamwork', '#CustomerObsession', '#Innovation'];

  useEffect(() => {
    if (!searchQuery.trim() || selectedRecipient) {
      setEmployees([]);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/users?search=${encodeURIComponent(searchQuery)}&excludeSelf=true`);
        if (res.data.success) {
          setEmployees(res.data.users);
          setDropdownOpen(true);
        }
      } catch (err) {
        setEmployees([]);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedRecipient]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      }
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRecipient) {
      showError('Please search and select a recipient colleague');
      return;
    }

    if (selectedRecipient._id === user?._id) {
      showError('You cannot send kudos to yourself');
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      showError('Appreciation message must be at least 5 characters long');
      return;
    }

    if (points > (user?.givingAllowance || 0)) {
      showError(`Insufficient points! You only have ${user?.givingAllowance || 0} giving points remaining.`);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/kudos', {
        recipientId: selectedRecipient._id,
        points: Number(points),
        message: message.trim(),
        tags: selectedTags
      });

      if (res.data.success) {
        showSuccess(res.data.message || `Sent ${points} kudos to ${selectedRecipient.name}!`);
        await refreshUser();
        if (onSuccess) onSuccess(res.data.kudos);

        setSelectedRecipient(null);
        setSearchQuery('');
        setMessage('');
        setPoints(20);
        setSelectedTags(['#Teamwork']);
        onClose();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to send kudos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 dark:border-slate-800 transform transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">Give Kudos</h2>
              <p className="text-xs text-brand-100">Recognize a colleague's outstanding work</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Recipient Search Autocomplete */}
          <div className="space-y-1.5" ref={searchContainerRef}>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Recipient <span className="text-rose-500">*</span>
            </label>
            {selectedRecipient ? (
              <div className="flex items-center justify-between p-3 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedRecipient.avatar}
                    alt={selectedRecipient.name}
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{selectedRecipient.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedRecipient.department} • {selectedRecipient.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRecipient(null);
                    setSearchQuery('');
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleague by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
                {searching && (
                  <div className="absolute right-3.5 top-3.5">
                    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {dropdownOpen && employees.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                    {employees.map((emp) => (
                      <button
                        key={emp._id}
                        type="button"
                        onClick={() => {
                          setSelectedRecipient(emp);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left p-3 hover:bg-brand-50/70 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">{emp.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{emp.department} • {emp.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Points Selection */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Kudos Points <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Available: <strong className="text-brand-600 dark:text-brand-400">{user?.givingAllowance || 0} pts</strong>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 50].map((pt) => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setPoints(pt)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm border flex flex-col items-center justify-center transition-all ${
                    points === pt
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm ring-2 ring-brand-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">+{pt}</span>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">points</span>
                </button>
              ))}
            </div>
          </div>

          {/* Value Tags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Company Value Tags <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Appreciation Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did your colleague accomplish? Write a thoughtful appreciation message..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedRecipient}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Kudos (+{points} pts)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiveKudosModal;
