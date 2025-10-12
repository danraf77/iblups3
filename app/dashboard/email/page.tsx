'use client';

import { useAuth } from '../useAuth';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export default function EmailPage() {
  const { t, currentLanguage } = useTranslation();
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail,
          action: 'change_email', // Indicar que es para cambio de email
          language: currentLanguage
        }),
      });

      if (response.ok) {
        setStep('otp');
        setMessage(t('email.success.codeSent'));
      } else {
        const data = await response.json();
        setMessage(data.error || t('email.errors.sendCodeError'));
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage(t('email.errors.sendCodeError'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newEmail: newEmail,
          otpCode: otpCode
        }),
      });

      if (response.ok) {
        setMessage(t('email.success.emailUpdated'));
        setStep('email');
        setNewEmail('');
        setOtpCode('');
        // Recargar la página para actualizar el email en la UI
        window.location.reload();
      } else {
        const data = await response.json();
        setMessage(data.error || t('email.errors.invalidCode'));
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage(t('email.errors.verificationError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#2c73ff] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">{t('email.title')}</h1>
            <p className="text-muted">{t('email.description')}</p>
          </div>
        </div>
      </div>

      {/* Current Email */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <h2 className="text-lg font-semibold text-primary mb-4">{t('email.currentEmail')}</h2>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#2c73ff] rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-primary font-medium">{user?.email}</p>
            <p className="text-sm text-muted">{t('email.currentEmailDescription')}</p>
          </div>
        </div>
      </div>

      {/* Change Email Form */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <h2 className="text-lg font-semibold text-primary mb-4">
          {step === 'email' ? t('email.newEmail') : t('email.verifyCode')}
        </h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message === t('email.success.codeSent') || message === t('email.success.emailUpdated')
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-primary mb-1">
                {t('email.newEmail')}
              </label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={t('email.newEmailPlaceholder')}
                required
                className="w-full px-3 py-2 bg-input text-primary rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setNewEmail('')}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors duration-200"
              >
                {t('email.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || !newEmail}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? t('email.sending') : t('email.sendCode')}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label htmlFor="otpCode" className="block text-sm font-medium text-primary mb-1">
                {t('email.verificationCode')}
              </label>
              <input
                type="text"
                id="otpCode"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder={t('email.verificationCodePlaceholder')}
                maxLength={4}
                required
                className="w-full px-3 py-2 bg-input text-primary rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:border-transparent text-center text-lg tracking-widest"
              />
              <p className="text-sm text-muted mt-1">
                {t('email.verificationCodeDescription', { email: newEmail })}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors duration-200"
              >
                {t('email.changeEmail')}
              </button>
              <button
                type="submit"
                disabled={loading || otpCode.length !== 4}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? t('email.verifying') : t('email.verifyAndChange')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security Info */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <h2 className="text-lg font-semibold text-primary mb-4">{t('email.securityInfo')}</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-[#2c73ff] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-primary font-medium">{t('email.otpVerification')}</p>
              <p className="text-sm text-muted">{t('email.otpVerificationDescription')}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-[#2c73ff] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-sm text-primary font-medium">{t('email.security')}</p>
              <p className="text-sm text-muted">{t('email.securityDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
