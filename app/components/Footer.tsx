'use client';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';
import ClientOnly from './ClientOnly';
import '../styles/footer.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        <div className="footer-content">
          {/* Main Footer Content */}
          <div className="footer-layout">
            {/* Language Selector */}
            <div className="footer-language-selector">
              <LanguageSelector />
            </div>

            {/* Legal Links */}
            <div className="footer-legal-links">
              <Link
                href="/privacy-policy"
                className="footer-legal-link"
              >
                <ClientOnly fallback="Privacy Policy">
                  {t('footer.privacyPolicy')}
                </ClientOnly>
              </Link>
              <Link
                href="/terms-of-service"
                className="footer-legal-link"
              >
                <ClientOnly fallback="Terms of Service">
                  {t('footer.termsOfService')}
                </ClientOnly>
              </Link>
              <Link
                href="/support"
                className="footer-legal-link"
              >
                <ClientOnly fallback="Support">
                  {t('footer.support')}
                </ClientOnly>
              </Link>
            </div>

            {/* Copyright */}
            <div className="footer-copyright">
              <p className="footer-copyright-text">
                <ClientOnly fallback="© 2024 danraf77 LLC - USA. All rights reserved.">
                  {t('footer.copyright')}
                </ClientOnly>
              </p>
              <p className="footer-powered-by">
                <ClientOnly fallback="Powered by">
                  {t('footer.poweredBy')}
                </ClientOnly>{' '}
                <a
                  href="https://danraf77.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-powered-by-link"
                >
                  danraf77.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
