
import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Loader2 } from 'lucide-react';

interface FaceIDOverlayProps {
  onSuccess: () => void;
}

const FaceIDOverlay: React.FC<FaceIDOverlayProps> = ({ onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('scanning');
      const scanTimer = setTimeout(() => {
        setStatus('success');
        const successTimer = setTimeout(() => {
          onSuccess();
        }, 800);
        return () => clearTimeout(successTimer);
      }, 2000);
      return () => clearTimeout(scanTimer);
    }, 500);
    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md">
      <div className="text-center p-8 max-w-sm w-full">
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className={`absolute inset-0 rounded-full border-4 border-indigo-500/30 ${status === 'scanning' ? 'animate-pulse' : ''}`}></div>
          <div className={`absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent ${status === 'scanning' ? 'animate-spin' : 'hidden'}`}></div>
          
          <div className="flex items-center justify-center h-full">
            {status === 'success' ? (
              <ShieldCheck className="w-16 h-16 text-emerald-400 animate-bounce" />
            ) : (
              <User className="w-16 h-16 text-indigo-300" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {status === 'idle' && 'Initializing Secure Login'}
          {status === 'scanning' && 'Scanning Face ID'}
          {status === 'success' && 'Authenticated'}
        </h2>
        <p className="text-slate-400">
          {status === 'scanning' ? 'Position your face in front of the camera' : 'Encrypted biometric verification'}
        </p>

        {status === 'scanning' && (
          <div className="mt-8 flex justify-center">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceIDOverlay;
