import React, { useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Sparkles, Send } from 'lucide-react';

const GiveKudosPage = () => {
  const { openGiveKudos } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    openGiveKudos();
  }, [openGiveKudos]);

  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-xl mx-auto my-12">
      <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto">
        <Sparkles className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-extrabold text-slate-900">Recognize a Colleague</h2>
      <p className="text-xs text-slate-500 max-w-md mx-auto">
        Appreciate someone today! Kudos points boost morale and highlight team achievements across departments.
      </p>
      <div className="pt-2">
        <button
          onClick={openGiveKudos}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-lg"
        >
          <Send className="w-4 h-4" />
          <span>Open Give Kudos Form</span>
        </button>
      </div>
    </div>
  );
};

export default GiveKudosPage;
