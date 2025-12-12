import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { resetPassword } from "@/lib/auth-helpers";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/hooks/useLanguage";

// Hero Images
import coupleImage from "@/assets/img-1.webp";

export const ForgotPassword = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(t.forgotPassword.errorInvalidEmail);
            setLoading(false);
            return;
        }

        const { error: authError } = await resetPassword(email);

        if (authError) {
            // Don't reveal if email exists (security best practice)
            // Show success message regardless to prevent email enumeration
            setSuccess(true);
            setSubmittedEmail(email);
        } else {
            setSuccess(true);
            setSubmittedEmail(email);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-nmb-smoke font-sans text-nmb-charcoal flex flex-col">
            {/* NavBar */}
            <NavBar />

            {/* Hero Section - Same Layout as Login */}
            <div className="relative min-h-[700px] bg-gradient-to-br from-nmb-smoke via-white to-nmb-smoke overflow-hidden">
                {/* Background subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-nmb-maroon/5 via-transparent to-transparent"></div>

                <div className="container mx-auto px-4 lg:px-8 h-full relative z-10">
                    <div className="grid lg:grid-cols-[50%_50%] gap-8 lg:gap-12 items-center min-h-[700px] py-12 lg:py-16">
                        
                        {/* Left Side (50%) - Password Reset Form */}
                        <div className="flex justify-center lg:justify-start items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="w-full max-w-md"
                            >
                                <div className="bg-white rounded-2xl shadow-card-elevated p-10 lg:p-12 border border-nmb-mist relative overflow-hidden">
                                    {/* Decorative top accent */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-nmb-maroon via-nmb-orange to-nmb-maroon"></div>
                                    
                                    {/* Form Header */}
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-heading font-bold text-nmb-charcoal mb-2">{t.forgotPassword.formTitle}</h3>
                                        <p className="text-gray-600 text-sm">{t.forgotPassword.formSubtitle}</p>
                                    </div>

                                    {success ? (
                                        <div className="space-y-6">
                                            {/* Success Message */}
                                            <div className="text-center py-4">
                                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                                <h4 className="text-xl font-bold text-nmb-charcoal mb-2">{t.forgotPassword.successTitle}</h4>
                                                <p className="text-gray-600 mb-2">
                                                    {t.forgotPassword.successMessage}
                                                </p>
                                                <p className="text-nmb-maroon font-semibold mb-4 break-all">{submittedEmail}</p>
                                                <p className="text-sm text-gray-500 mb-6">
                                                    {t.forgotPassword.successNote}
                                                </p>
                                            </div>

                                            {/* Resend Button */}
                                            <Button
                                                onClick={() => {
                                                    setSuccess(false);
                                                    setEmail('');
                                                    setSubmittedEmail('');
                                                }}
                                                className="w-full bg-gray-100 hover:bg-gray-200 text-nmb-charcoal font-semibold h-14 rounded-xl transition-all duration-300 text-base"
                                            >
                                                {t.forgotPassword.resendButton}
                                            </Button>

                                            {/* Back to Login */}
                                            <div className="pt-4 text-center border-t border-gray-100">
                                                <Link 
                                                    to="/login" 
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline-offset-4 hover:underline transition-colors"
                                                >
                                                    {t.forgotPassword.backToLogin}
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleResetPassword} className="space-y-6">
                                            {error && (
                                                <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                                                    {error}
                                                </div>
                                            )}

                                            {/* Email Field */}
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-semibold text-nmb-charcoal">
                                                    {t.forgotPassword.emailLabel}
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder={t.forgotPassword.emailPlaceholder}
                                                        className="pl-12 h-14 bg-gray-50 border-gray-300 focus:bg-white focus:border-nmb-maroon focus:ring-2 focus:ring-nmb-maroon/20 rounded-xl text-base transition-all"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-nmb-maroon hover:bg-[#6e0e00] text-white font-bold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base mt-2"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <span className="animate-spin">⏳</span>
                                                        {t.forgotPassword.submittingButton}
                                                    </span>
                                                ) : (
                                                    t.forgotPassword.submitButton
                                                )}
                                            </Button>

                                            {/* Login Link */}
                                            <div className="pt-4 text-center border-t border-gray-100">
                                                <p className="text-sm text-gray-600">
                                                    {t.forgotPassword.rememberPassword}{" "}
                                                    <Link 
                                                        to="/login" 
                                                        className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-4 hover:underline transition-colors"
                                                    >
                                                        {t.forgotPassword.loginLink}
                                                    </Link>
                                                </p>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side (50%) - Marketing Content */}
                        <div className="relative flex flex-col justify-center space-y-6">
                            {/* Marketing Copy */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="space-y-4"
                            >
                                <p className="text-xs font-bold text-nmb-orange uppercase tracking-[0.2em]">
                                    {t.forgotPassword.marketingSubtitle}
                                </p>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-nmb-maroon leading-tight">
                                    {t.forgotPassword.marketingTitle}
                                </h1>
                                <p className="text-lg text-gray-600">
                                    {t.forgotPassword.subtitle}
                                </p>
                                <p className="text-base text-gray-500">
                                    {t.forgotPassword.marketingReassurance}
                                </p>
                                
                                {/* Security Features */}
                                <div className="space-y-3 mt-6">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-nmb-maroon flex-shrink-0" />
                                        <span className="text-gray-700">{t.forgotPassword.securityFeature1}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Lock className="h-5 w-5 text-nmb-maroon flex-shrink-0" />
                                        <span className="text-gray-700">{t.forgotPassword.securityFeature2}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                        <span className="text-gray-700">{t.forgotPassword.securityFeature3}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Couple Image - Same Treatment as Login */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="relative group"
                            >
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-nmb-maroon/10 via-transparent to-nmb-orange/5 z-10 pointer-events-none"></div>
                                    <img
                                        src={coupleImage}
                                        alt="Secure banking experience"
                                        className="w-full h-auto object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700"
                                        style={{ 
                                            filter: 'brightness(1.05) contrast(1.05) saturate(1.1)',
                                        }}
                                    />
                                </div>
                                <div className="absolute -inset-4 bg-nmb-maroon/10 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Pillars - Same as Login */}
            <div className="relative z-20 bg-nmb-smoke py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24">
                        {/* 1. Security */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <Shield className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">Secure Banking</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Bank-level security with 24/7 monitoring. Your financial data is protected with industry-leading encryption.
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                More Info <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {/* 2. Support */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">24/7 Support</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Our dedicated support team is available around the clock to help you with any account-related issues.
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                More Info <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {/* 3. Easy Recovery */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <Lock className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">Easy Recovery</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Forgot your password? No problem. Our secure reset process gets you back into your account quickly.
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                More Info <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

