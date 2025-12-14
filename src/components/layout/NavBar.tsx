import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Phone, Menu, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import logo from "@/assets/nmb-logo.svg";

export const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, t } = useLanguage();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isForgotPasswordPage = location.pathname === "/forgot-password";
  const isAuthPage = isLoginPage || isRegisterPage || isForgotPasswordPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Bar 1 - Top Utility Bar */}
      <div className="bg-nmb-maroon text-white text-xs h-10 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between w-full">
          {/* Left: Phone + Email with icons, separated by vertical line */}
          <div className="flex items-center gap-4">
            <a 
              href="tel:+74957969355" 
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+7 (495) 796-93-55</span>
            </a>
            <div className="h-4 w-px bg-white/30"></div>
            <a 
              href="mailto:info@nmbank.ru" 
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>info@nmbank.ru</span>
            </a>
          </div>
          {/* Right: Language Toggle */}
          <LanguageToggle className="text-white" />
        </div>
      </div>

      {/* Bar 2 - Main Navigation */}
      <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-shadow duration-200 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo (clickable to dashboard) */}
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="flex flex-col items-center hover:opacity-90 transition-opacity cursor-pointer">
                <img src={logo} alt={t.nav.bankName} className="h-10 w-auto" />
                <span className="text-nmb-orange font-sans text-sm font-medium mt-1">New Moscow Bank</span>
              </Link>
            </div>

            {/* Center: Navigation Links - Hidden on login page */}
            {!isAuthPage && (
              <div className="hidden lg:flex items-center h-full gap-1">
                {[
                  { href: "#accounts", label: t.nav.personal, key: "personal" },
                  { href: "#services", label: t.nav.corporate, key: "corporate" },
                  { href: "#services", label: t.nav.sme, key: "sme" },
                  { href: "#about", label: t.nav.about, key: "about" },
                ].map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="relative px-6 py-2 h-full flex items-center text-sm font-semibold text-gray-700 hover:text-nmb-maroon transition-colors duration-200"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`nav-${item.key}-${language}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {item.label}
                      </motion.span>
                    </AnimatePresence>
                  </a>
                ))}
              </div>
            )}

            {/* Right: Auth Links or Actions */}
            <div className="flex items-center gap-3">
              {isAuthPage ? (
                isLoginPage ? (
                  /* Login Page: Only show "Don't have an account? Register" text link */
                  <Link 
                    to="/register" 
                    className="text-sm text-gray-600 hover:text-nmb-maroon transition-colors duration-200"
                  >
                    {t.nav.dontHaveAccount} <span className="font-semibold text-nmb-maroon underline">{t.register.submitButton}</span>
                  </Link>
                ) : (
                  /* Register / Forgot Password: show back to login */
                  <Link 
                    to="/login" 
                    className="text-sm text-gray-600 hover:text-nmb-maroon transition-colors duration-200"
                  >
                    {t.nav.alreadyHaveAccount} <span className="font-semibold text-nmb-maroon underline">{t.nav.login}</span>
                  </Link>
                )
              ) : (
                <>
                  {/* Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>

                  {/* Login Button (outline style with maroon border) */}
                  <Link to="/login" className="hidden lg:block">
                    <Button
                      variant="outline"
                      className="border-nmb-maroon text-nmb-maroon hover:bg-nmb-maroon hover:text-white transition-all duration-200 font-semibold px-6 h-10"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`btn-login-${language}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {t.nav.login}
                        </motion.span>
                      </AnimatePresence>
                    </Button>
                  </Link>

                  {/* Open Account Button (filled with maroon background) */}
                  <Link to="/register" className="hidden lg:block">
                    <Button
                      className="bg-nmb-maroon hover:bg-nmb-maroon/90 text-white transition-all duration-200 font-semibold px-6 h-10"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`btn-open-${language}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {t.nav.openAccount}
                        </motion.span>
                      </AnimatePresence>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Hidden on auth pages */}
      {!isAuthPage && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              className="fixed inset-0 z-50 bg-white lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="bg-nmb-maroon text-white px-6 py-4 flex items-center justify-between">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-10 flex items-center">
                        <img src={logo} alt={t.nav.bankName} className="h-full w-auto" />
                      </div>
                      <span className="text-nmb-orange font-sans text-sm font-medium mt-1">New Moscow Bank</span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col flex-1 overflow-y-auto">
                  {[
                    { href: "#accounts", label: t.nav.personal, key: "personal" },
                    { href: "#services", label: t.nav.corporate, key: "corporate" },
                    { href: "#services", label: t.nav.sme, key: "sme" },
                    { href: "#about", label: t.nav.about, key: "about" },
                  ].map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-semibold text-gray-900 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 hover:text-nmb-maroon transition-all duration-200"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`mobile-${item.key}-${language}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.15 }}
                        >
                          {item.label}
                        </motion.span>
                      </AnimatePresence>
                    </a>
                  ))}

                  {/* Mobile Actions */}
                  <div className="mt-auto p-6 space-y-3 bg-gray-50 border-t border-gray-200">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-white hover:border-nmb-maroon hover:text-nmb-maroon font-semibold h-12">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`mobile-login-${language}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {t.nav.login}
                          </motion.span>
                        </AnimatePresence>
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-nmb-maroon hover:bg-nmb-maroon/90 text-white font-semibold h-12">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`mobile-open-${language}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {t.nav.openAccount}
                          </motion.span>
                        </AnimatePresence>
                      </Button>
                    </Link>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

