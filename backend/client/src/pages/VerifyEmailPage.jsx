import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/verify-email', { token, email });
      if (res.data.success) {
        setVerified(true);
        showSuccess('Email verified successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token || email) {
      handleVerify();
    }
  }, [token, email]);

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100 text-center">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">Simulated Email Verification</h2>
        <p className="text-xs text-slate-500 mb-6">
          Development environment simulation mode. Verification token generated automatically.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {verified ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <p className="font-semibold text-sm">Your email has been verified!</p>
              <p className="text-xs text-emerald-700">You can now proceed to log in to Team Kudos.</p>
            </div>
            <Link
              to="/login"
              className="w-full inline-block py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-lg transition-all"
            >
              Log In Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 break-all">
              Token: {token || 'N/A'}
            </p>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Verifying...' : 'Complete Verification'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
