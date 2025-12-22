import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Building2, ArrowRight, LayoutDashboard, Loader2, Eye, EyeOff } from "lucide-react";
import PageLoader from "../components/ui/PageLoader";

export default function Login() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyingAuth, setVerifyingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/api/company/me");
                navigate("/editor");
            } catch (err) {
                // Not authenticated, stay on login page
                setVerifyingAuth(false);
            }
        };
        checkAuth();
    }, [navigate]);

    if (verifyingAuth) return <PageLoader text="Verifying session..." />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignup) {
                await api.post("/api/auth/signup", {
                    email,
                    password,
                    companyName
                });
                toast.success("Account created successfully!");
            } else {
                await api.post("/api/auth/login", {
                    email,
                    password
                });
                toast.success("Logged in successfully!");
            }

            navigate("/editor");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden font-sans">
            {/* Background Gradient Blob */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 px-6 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/50 mb-6 transform rotate-3">
                        <LayoutDashboard className="text-white h-8 w-8" />
                    </div>
                    <h2 className="text-center text-3xl font-bold text-white tracking-tight">
                        {isSignup ? "Start By Setting Up Your Account!" : "Welcome Back!"}
                    </h2>
                    <p className="mt-3 text-center text-slate-400 max-w-xs mx-auto">
                        {isSignup 
                            ? "Welcome to CareerBuilder! Let's get started by setting up your account." 
                            : "Log in to manage your career page and connect with talent."}
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {isSignup && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                                Company Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required={isSignup}
                                    className="appearance-none block w-full px-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Select your company name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                placeholder="tim.jennings@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none block w-full px-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {!isSignup && (
                            <div className="flex justify-end mt-2">
                                <button type="button" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                                    Forget Password?
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-900/20 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                isSignup ? "Create an account" : "Log in"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-950 text-slate-500">
                                Or {isSignup ? "sign in" : "sign up"} with
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                    >
                        {isSignup ? "Already have an account? Sign In" : "Don't have an account? Create one"}
                    </button>
                </div>
            </div>
        </div>
    );
}
