import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Mail, Phone, CheckCircle, XCircle, ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { seedNewUser } from "@/lib/seedData";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";

// Hero Images
import coupleImage from "@/assets/Register-Page.png";

interface PasswordStrength {
    score: number; // 0-4
    label: string;
    color: string;
}

const calculatePasswordStrength = (password: string, t: any): PasswordStrength => {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    if (score === 0) return { score: 0, label: t.register.passwordWeak, color: "bg-red-500" };
    if (score <= 2) return { score: 1, label: t.register.passwordWeak, color: "bg-red-500" };
    if (score === 3) return { score: 2, label: t.register.passwordMedium, color: "bg-orange-500" };
    return { score: 3, label: t.register.passwordStrong, color: "bg-green-500" };
};

export const Register = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const passwordStrength = calculatePasswordStrength(password, t);
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!acceptedTerms) {
            setError(t.register.errorTermsNotAccepted);
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError(t.register.passwordsNotMatch);
            setLoading(false);
            return;
        }

        if (passwordStrength.score < 2) {
            setError(t.register.errorPasswordWeak);
            setLoading(false);
            return;
        }

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // IMMEDIATELY seed user data
            await seedNewUser(user.uid, email, fullName);

            toast({
                title: "Account Created Successfully",
                description: `Welcome ${fullName}! Your account has been created. Redirecting to dashboard...`,
            });

            setSuccess(true);
            // Redirect to dashboard after 1.5 seconds
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
            redirectTimeoutRef.current = setTimeout(() => {
                navigate("/dashboard");
                redirectTimeoutRef.current = null;
            }, 1500);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && error.message.includes("email-already-in-use")
                ? t.register.errorEmailExists
                : error instanceof Error && error.message.includes("weak-password")
                    ? t.register.errorPasswordWeak
                    : t.register.errorRegistrationFailed;
            setError(errorMessage);
            toast({
                title: "Registration Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
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
                        
                        {/* Left Side (50%) - Marketing Content with Image */}
                        <div className="relative flex flex-col justify-center space-y-6">
                            {/* Marketing Copy */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="space-y-4"
                            >
                                <p className="text-xs font-bold text-nmb-orange uppercase tracking-[0.2em]">
                                    {t.register.marketingSubtitle}
                                </p>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-nmb-maroon leading-tight">
                                    {t.register.marketingTitle}
                                </h1>
                                <p className="text-lg text-gray-600">
                                    {t.register.subtitle}
                                </p>
                                
                                {/* Benefits List */}
                                <div className="space-y-3 mt-6">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                        <span className="text-gray-700">{t.register.benefit1}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-nmb-maroon flex-shrink-0" />
                                        <span className="text-gray-700">{t.register.benefit2}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-nmb-maroon flex-shrink-0" />
                                        <span className="text-gray-700">{t.register.benefit3}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Award className="h-5 w-5 text-nmb-orange flex-shrink-0" />
                                        <span className="text-gray-700">{t.register.benefit4}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Couple Image */}
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
                                        alt="Happy couple planning their finances together"
                                        className="w-full h-auto object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700"
                                        style={{ 
                                            filter: 'brightness(1.05) contrast(1.05) saturate(1.1)',
                                        }}
                                    />
                                </div>
                                <div className="absolute -inset-4 bg-nmb-maroon/10 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
                            </motion.div>
                        </div>

                        {/* Right Side (50%) - Registration Form */}
                        <div className="flex justify-center lg:justify-end items-center">
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
                                        <h3 className="text-3xl font-heading font-bold text-nmb-charcoal mb-2">{t.register.formTitle}</h3>
                                        <p className="text-gray-600 text-sm">{t.register.formSubtitle}</p>
                                    </div>

                                    {success ? (
                                        <div className="text-center py-8">
                                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                            <h4 className="text-xl font-bold text-nmb-charcoal mb-2">{t.register.successTitle}</h4>
                                            <p className="text-gray-600 mb-6">{t.register.successMessage}</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleRegister} className="space-y-6">
                                            {error && (
                                                <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                                                    {error}
                                                </div>
                                            )}

                                            {/* Full Name Field */}
                                            <div className="space-y-2">
                                                <label htmlFor="fullName" className="text-sm font-semibold text-nmb-charcoal">
                                                    {t.register.fullNameLabel}
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        id="fullName"
                                                        type="text"
                                                        placeholder={t.register.fullNamePlaceholder}
                                                        className="pl-12 h-14 bg-gray-50 border-gray-300 focus:bg-white focus:border-nmb-maroon focus:ring-2 focus:ring-nmb-maroon/20 rounded-xl text-base transition-all"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Email Field */}
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-semibold text-nmb-charcoal">
                                                    {t.register.emailLabel}
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder={t.register.emailPlaceholder}
                                                        className="pl-12 h-14 bg-gray-50 border-gray-300 focus:bg-white focus:border-nmb-maroon focus:ring-2 focus:ring-nmb-maroon/20 rounded-xl text-base transition-all"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone Field */}
                                            <div className="space-y-2">
                                                <label htmlFor="phone" className="text-sm font-semibold text-nmb-charcoal">
                                                    {t.register.phoneLabel}
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder={t.register.phonePlaceholder}
                                                        className="pl-12 h-14 bg-gray-50 border-gray-300 focus:bg-white focus:border-nmb-maroon focus:ring-2 focus:ring-nmb-maroon/20 rounded-xl text-base transition-all"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Password Field */}
                                            <div className="space-y-2">
                                                <label htmlFor="password" className="text-sm font-semibold text-nmb-charcoal">
                                                    {t.register.passwordLabel}
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder={t.register.passwordPlaceholder}
                                                        className="pl-12 pr-12 h-14 bg-gray-50 border-gray-300 focus:bg-white focus:border-nmb-maroon focus:ring-2 focus:ring-nmb-maroon/20 rounded-xl text-base transition-all"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-nmb-maroon transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                                
                                                {/* Password Strength Indicator */}
                                                {password.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-600">{t.register.passwordStrength}</span>
                                                            <span className={`text-xs font-semibold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                                                {passwordStrength.label}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                                style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                                                            />
                                                        </div>
                                                        {/* Requirements Checklist */}
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            <div className={`flex items-center gap-2 text-xs ${passwordChecks.length ? 'text-green-600' : 'text-gray-400'}`}>
                                                                {passwordChecks.length ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                                {t.register.passwordRequirement1}
                                                            </div>
                                                            <div className={`flex items-center gap-2 text-xs ${passwordChecks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                                                {passwordChecks.uppercase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                                {t.register.passwordRequirement2}
                                                            </div>
                                                            <div className={`flex items-center gap-2 text-xs ${passwordChecks.number ? 'text-green-600' : 'text-gray-400'}`}>
                                                                {passwordChecks.number ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                                {t.register.passwordRequirement3}
                                                            </div>
                                                            <div className={`flex items-center gap-2 text-xs ${passwordChecks.special ? 'text-green-600' : 'text-gray-400'}`}>
                                                                {passwordChecks.special ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                                {t.register.passwordRequirement4}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Confirm Password Field */}
                                            <div className="space-y-2">
                                                <label htmlFor="confirmPassword" className="text-sm font-semibold text-nmb-charcoal">
                                                    {t.register.confirmPasswordLabel}
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        id="confirmPassword"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder={t.register.confirmPasswordPlaceholder}
                                                        className={`pl-12 pr-12 h-14 bg-gray-50 border-gray-300 focus:bg-white focus:ring-2 focus:ring-nmb-maroon/20 rounded-xl text-base transition-all ${
                                                            confirmPassword.length > 0 
                                                                ? passwordsMatch 
                                                                    ? 'border-green-500 focus:border-green-500' 
                                                                    : 'border-red-500 focus:border-red-500'
                                                                : 'focus:border-nmb-maroon'
                                                        }`}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-nmb-maroon transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                                {confirmPassword.length > 0 && !passwordsMatch && (
                                                    <p className="text-xs text-red-600">{t.register.passwordsNotMatch}</p>
                                                )}
                                            </div>

                                            {/* Terms Checkbox */}
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    checked={acceptedTerms}
                                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                    className="mt-1 h-4 w-4 text-nmb-maroon border-gray-300 rounded focus:ring-nmb-maroon"
                                                    required
                                                />
                                                <label htmlFor="terms" className="text-sm text-gray-600">
                                                    {t.register.termsLabel}{" "}
                                                    <a href="#" className="text-blue-600 hover:underline">{t.register.termsLink}</a>
                                                    {" "}and{" "}
                                                    <a href="#" className="text-blue-600 hover:underline">{t.register.privacyLink}</a>
                                                </label>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                disabled={loading || !acceptedTerms}
                                                className="w-full bg-nmb-maroon hover:bg-[#6e0e00] text-white font-bold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base mt-2"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <span className="animate-spin">⏳</span>
                                                        {t.register.submittingButton}
                                                    </span>
                                                ) : (
                                                    t.register.submitButton
                                                )}
                                            </Button>

                                            {/* Login Link */}
                                            <div className="pt-4 text-center border-t border-gray-100">
                                                <p className="text-sm text-gray-600">
                                                    {t.register.alreadyHaveAccount}{" "}
                                                    <Link 
                                                        to="/login" 
                                                        className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-4 hover:underline transition-colors"
                                                    >
                                                        {t.register.loginLink}
                                                    </Link>
                                                </p>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Pillars - Same as Login */}
            <div className="relative z-20 bg-nmb-smoke py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24">
                        {/* 1. Individuals */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <User className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">{t.register.servicePillars.individuals.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t.register.servicePillars.individuals.description}
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                {t.register.servicePillars.individuals.moreInfo} <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {/* 2. Corporate */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <Shield className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">{t.register.servicePillars.corporate.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t.register.servicePillars.corporate.description}
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                {t.register.servicePillars.corporate.moreInfo} <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {/* 3. Security */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <Award className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">{t.register.servicePillars.secureBanking.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t.register.servicePillars.secureBanking.description}
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                {t.register.servicePillars.secureBanking.moreInfo} <ArrowRight className="h-4 w-4 ml-2" />
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

