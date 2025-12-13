import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface LoginWidgetProps {
    variant?: 'default' | 'glass';
}

export const LoginWidget = ({ variant = 'default' }: LoginWidgetProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (import.meta.env.DEV) {
                console.log("Logged in successfully!");
            }
            // Navigation would usually happen here via a listener in a higher component or router
        } catch (err: any) {
            if (import.meta.env.DEV) {
                console.error("Login failed", err);
            }
            // Provide more specific error messages
            const errorCode = err?.code;
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                setError("Invalid email or password. Please check your credentials and try again.");
            } else if (errorCode === 'auth/invalid-email') {
                setError("Please enter a valid email address.");
            } else if (errorCode === 'auth/too-many-requests') {
                setError("Too many failed login attempts. Please try again later.");
            } else {
                setError("Unable to sign in. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn(
            "rounded-xl p-8 w-full max-w-md z-10 relative transition-all duration-300",
            variant === 'glass'
                ? "bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-glow-orange/20 hover:-translate-y-1"
                : "bg-white shadow-2xl border border-gray-100"
        )}>
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-nmb-maroon mb-2">Internet Banking</h3>
                <p className="text-gray-500 text-sm">Securely access your accounts</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

                <div className="space-y-2">
                    <Label htmlFor="email">User ID / Email</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your User ID"
                            className="pl-10 border-gray-300 focus:border-nmb-orange focus-visible:ring-nmb-orange/20 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 border-gray-300 focus:border-nmb-orange focus-visible:ring-nmb-orange/20 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="text-nmb-charcoal/70 hover:text-nmb-orange underline-offset-4 hover:underline transition-colors">
                        Forgot Password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-nmb-maroon hover:bg-nmb-maroon/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Login to NetBanking"}
                </Button>

                <div className="pt-4 text-center border-t border-gray-100 mt-6">
                    <p className="text-sm text-gray-600">
                        New User? <Link to="/register" className="text-nmb-orange font-semibold hover:underline">Register Now</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};
