import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Building2, CreditCard, Users, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";

// New Hero Images
import coupleImage from "@/assets/img-1.webp";

export const Login = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    
    // Login Form State
    const [activeTab, setActiveTab] = useState<'personal' | 'corporate'>('personal');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: "Login Successful",
                description: "Welcome back! Redirecting to dashboard...",
            });
            // Redirect to dashboard on success
            navigate("/dashboard");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && error.message.includes("user-not-found")
                ? t.login.errorInvalidCredentials
                : error instanceof Error && error.message.includes("wrong-password")
                    ? t.login.errorInvalidCredentials
                    : t.login.errorInvalidCredentials;
            setError(errorMessage);
            toast({
                title: "Login Failed",
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

            {/* Hero Section - Modern Asymmetric Layout */}
            <div className="relative min-h-[700px] bg-gradient-to-br from-nmb-smoke via-white to-nmb-smoke overflow-hidden">
                {/* Background subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-nmb-maroon/5 via-transparent to-transparent"></div>

                <div className="container mx-auto px-4 lg:px-8 h-full relative z-10">
                    <div className="grid lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-center min-h-[700px] py-12 lg:py-16">
                        
                        {/* Left Side (55%) - Enhanced Login Form */}
                        <div className="flex justify-center lg:justify-start items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="w-full max-w-md"
                            >
                                <div className="bg-white rounded-2xl shadow-card-elevated p-10 lg:p-12 border border-nmb-mist relative overflow-hidden">
                                    {/* Decorative top accent - thicker for more impact */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-nmb-maroon via-nmb-orange to-nmb-maroon"></div>
                                    
                                    {/* Form Header */}
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-heading font-bold text-nmb-charcoal mb-2">{t.login.formTitle}</h3>
                                        <p className="text-gray-600 text-sm">{t.login.formSubtitle}</p>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-6">
                                        {error && (
                                            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                                                {error}
                                            </div>
                                        )}

                                        {/* Email/Login ID Field */}
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-semibold text-nmb-charcoal">
                                                {t.login.userIdLabel}
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder={t.login.userIdPlaceholder}
                                                    className="pl-12 h-14 bg-gray-50 border-gray-300 focus:bg-white focus:border-nmb-maroon focus:ring-2 focus:ring-nmb-maroon/20 rounded-xl text-base transition-all"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <label htmlFor="password" className="text-sm font-semibold text-nmb-charcoal">
                                                {t.login.passwordLabel}
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder={t.login.passwordPlaceholder}
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
                                        </div>

                                        {/* Forgot Password Link */}
                                        <div className="flex justify-end">
                                            <Link 
                                                to="/forgot-password" 
                                                className="text-sm text-nmb-maroon hover:text-nmb-orange font-medium underline-offset-4 hover:underline transition-colors"
                                            >
                                                {t.login.forgotPassword}
                                            </Link>
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
                                                    {t.login.submittingButton}
                                                </span>
                                            ) : (
                                                t.login.submitButton
                                            )}
                                        </Button>

                                        {/* Registration Link */}
                                        <div className="pt-4 text-center border-t border-gray-100">
                                            <p className="text-sm text-gray-600">
                                                {t.login.newUser}{" "}
                                                <Link 
                                                    to="/register" 
                                                    className="text-nmb-maroon hover:text-nmb-orange font-semibold underline-offset-4 hover:underline transition-colors"
                                                >
                                                    {t.login.registerNow}
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side (45%) - Couple Image with Marketing Copy */}
                        <div className="relative flex flex-col justify-center space-y-6">
                            {/* Marketing Copy */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="space-y-4"
                            >
                                <p className="text-xs font-bold text-nmb-orange uppercase tracking-[0.2em]">
                                    {t.login.marketingSubtitle}
                                </p>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-nmb-maroon leading-tight">
                                    {t.login.marketingTitle}
                                </h1>
                            </motion.div>

                            {/* Couple Image - Floating Card Style */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="relative group"
                            >
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    {/* Subtle warm color overlay */}
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
                                {/* Decorative shadow glow */}
                                <div className="absolute -inset-4 bg-nmb-maroon/10 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Service Pillars (Individuals, Corporate, Cards) */}
            <div className="relative z-20 bg-nmb-smoke py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24">
                        {/* 1. Individuals */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <Users className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">{t.login.servicePillars.individuals.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t.login.servicePillars.individuals.description}
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                {t.login.servicePillars.individuals.moreInfo} <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {/* 2. Corporate */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <Building2 className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">{t.login.servicePillars.corporate.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t.login.servicePillars.corporate.description}
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                {t.login.servicePillars.corporate.moreInfo} <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {/* 3. Plastic Cards */}
                        <div className="bg-white p-8 rounded-lg shadow-card border-b-4 border-nmb-maroon hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
                            <div className="h-14 w-14 bg-nmb-maroon/10 text-nmb-maroon rounded-full flex items-center justify-center mb-6">
                                <CreditCard className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-nmb-maroon mb-4">{t.login.servicePillars.cards.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t.login.servicePillars.cards.description}
                            </p>
                            <a href="#" className="inline-flex items-center text-nmb-orange font-bold hover:underline">
                                {t.login.servicePillars.cards.moreInfo} <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Bank News Section */}
            <div className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-10 border-b border-nmb-mist pb-4">
                        <h2 className="text-3xl font-bold text-nmb-charcoal">{t.login.news.title}</h2>
                        <a href="#" className="text-nmb-maroon font-semibold hover:underline">{t.login.news.allNews}</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* News Item 1 */}
                        <div className="group cursor-pointer">
                            <span className="text-sm font-bold text-gray-400 mb-2 block">{t.login.news.items.commissionFree.date}</span>
                            <h3 className="text-xl font-bold text-nmb-maroon mb-3 group-hover:text-nmb-orange transition-colors">
                                {t.login.news.items.commissionFree.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                {t.login.news.items.commissionFree.description}
                            </p>
                            <span className="text-nmb-maroon font-medium text-sm group-hover:underline">{t.login.news.readFullStory}</span>
                        </div>

                        {/* News Item 2 */}
                        <div className="group cursor-pointer">
                            <span className="text-sm font-bold text-gray-400 mb-2 block">{t.login.news.items.mirTransition.date}</span>
                            <h3 className="text-xl font-bold text-nmb-maroon mb-3 group-hover:text-nmb-orange transition-colors">
                                {t.login.news.items.mirTransition.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                {t.login.news.items.mirTransition.description}
                            </p>
                            <span className="text-nmb-maroon font-medium text-sm group-hover:underline">{t.login.news.readFullStory}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Using consistent Footer component */}
            <Footer />

        </div>
    );
};
