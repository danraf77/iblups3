'use client';
import React, { useState, useEffect } from 'react';
import { X, Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTranslation as useI18n } from 'react-i18next';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: string; email: string; username?: string; display_name?: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const { i18n } = useI18n();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail('');
      setOtp('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending OTP request with:', { email, language: i18n.language || 'es' });
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          language: i18n.language || 'es' // Enviar idioma actual - Implementado por Cursor
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSuccess(t('messages.success.otpSent'));
        setStep('otp');
      } else {
        setError(data.error || t('messages.errors.sendOtpError'));
      }
    } catch {
      console.error('Error sending OTP');
      setError(t('messages.errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('messages.success.loginSuccess'));
        setTimeout(() => {
          onSuccess(data.user);
          onClose();
        }, 1000);
      } else {
        setError(data.error || t('messages.errors.invalidOtp'));
      }
    } catch {
      setError(t('messages.errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Resending OTP request with:', { email, language: i18n.language || 'es' });
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          language: i18n.language || 'es' // Enviar idioma actual - Implementado por Cursor
        }),
      });

      console.log('Resend response status:', response.status);
      const data = await response.json();
      console.log('Resend response data:', data);

      if (response.ok) {
        setSuccess(t('messages.success.otpSent'));
      } else {
        setError(data.error || t('messages.errors.sendOtpError'));
      }
    } catch {
      console.error('Error resending OTP');
      setError(t('messages.errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-primary">
            {step === 'email' ? t('auth.modal.title.login') : t('auth.modal.title.verify')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-button rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-primary" size={32} />
                </div>
                <p className="text-gray-300">
                  {t('auth.modal.email.description')}
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                  {t('auth.modal.email.label')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent"
                  placeholder={t('auth.modal.email.placeholder')}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-button text-button py-3 px-4 rounded-lg font-medium hover:bg-button-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.modal.email.sending') : t('auth.modal.email.button')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-button rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-primary" size={32} />
                </div>
                <p className="text-gray-300">
                  {t('auth.modal.otp.description')}
                </p>
                <p className="text-primary font-medium">{email}</p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-primary mb-2">
                  {t('auth.modal.otp.label')}
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder={t('auth.modal.otp.placeholder')}
                  maxLength={4}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  <span>{success}</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 4}
                  className="w-full bg-button text-button py-3 px-4 rounded-lg font-medium hover:bg-button-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('auth.modal.otp.verifying') : t('auth.modal.otp.button')}
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  {loading ? t('auth.modal.otp.resending') : t('auth.modal.otp.resend')}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  {t('auth.modal.otp.changeEmail')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Comentario: Modal de autenticación creado con Cursor
// - Diseño moderno y responsive
// - Flujo de 2 pasos (email + OTP)
// - Validación en tiempo real
// - Estados de carga y error
// - Reenvío de códigos
// - UX optimizada
