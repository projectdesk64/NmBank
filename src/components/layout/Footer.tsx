import React from 'react';
import { Lock, Facebook, Twitter, Linkedin } from 'lucide-react';
import nmbLogo from '@/assets/nmb-logo.svg';
import { useLanguage } from '@/hooks/useLanguage';

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-nmb-charcoal text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1 mb-2">
              <img src={nmbLogo} alt="NMB Logo" className="h-10 w-auto" />
              <span className="text-nmb-orange font-sans text-sm font-medium">New Moscow Bank</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-heading font-semibold text-nmb-orange mb-2">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {[
                t.footer.aboutUs,
                t.footer.careers,
                t.footer.privacyPolicy,
                t.footer.termsOfService,
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-heading font-semibold text-nmb-orange mb-2">{t.footer.support}</h4>
            <ul className="space-y-2">
              {[
                t.footer.helpCenter,
                t.footer.reportFraud,
                t.footer.locateBranch,
                t.footer.contactUs,
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Security Message */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-heading font-semibold text-nmb-orange mb-2">{t.footer.security}</h4>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Lock className="h-5 w-5 text-nmb-orange" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {t.footer.securityMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              {t.footer.copyright}
            </p>

            {/* Social Icons - Larger (24px) */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
