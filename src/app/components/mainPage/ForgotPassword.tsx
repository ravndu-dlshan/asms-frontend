"use client";

import { FormEvent, useState, useEffect } from "react";
import { forgotPassword, resetPassword } from "@/app/services/UserRegisterAndLoginServices";
import { useRouter } from "next/navigation";
import ErrorPopUp from "@/app/components/ErrorPopuUp";

type Props = {
    onBackToLogin?: () => void;
};

export default function ForgotPassword({ onBackToLogin }: Props) {
    const [step, setStep] = useState<1 | 2>(1); // Step 1: Email, Step 2: OTP + Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [errorPopup, setErrorPopup] = useState({ 
        open: false, 
        message: "", 
        type: "error" as "error" | "success" | "warning" | "info" 
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Real-time password match validation
    useEffect(() => {
        if (confirmPassword) {
            setPasswordMatch(newPassword === confirmPassword);
        } else {
            setPasswordMatch(true);
        }
    }, [newPassword, confirmPassword]);

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setErrorPopup({ 
                open: true, 
                message: "Please enter your email address.", 
                type: "warning" 
            });
            return;
        }

        setIsLoading(true);
        setMessage("Sending reset code...");

        try {
            const result = await forgotPassword(email);
            
            if (result.success) {
                setMessage("Reset code sent! Please check your email.");
                setStep(2);
            } else {
                setErrorPopup({ 
                    open: true, 
                    message: "Failed to send reset code. Please try again.", 
                    type: "error" 
                });
                setMessage(null);
            }
        } catch (error: any) {
            setErrorPopup({ 
                open: true, 
                message: error.message || "An error occurred. Please try again.", 
                type: "error" 
            });
            setMessage(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e: FormEvent) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            setErrorPopup({ 
                open: true, 
                message: "Please fill in all fields.", 
                type: "warning" 
            });
            return;
        }

        if (!passwordMatch) {
            setErrorPopup({ 
                open: true, 
                message: "Passwords do not match.", 
                type: "warning" 
            });
            return;
        }

        if (newPassword.length < 6) {
            setErrorPopup({ 
                open: true, 
                message: "Password must be at least 6 characters long.", 
                type: "warning" 
            });
            return;
        }

        setIsLoading(true);
        setMessage("Resetting password...");

        try {
            const result = await resetPassword({
                email,
                otp,
                newPassword: confirmPassword
            });

            if (result.success) {
                setMessage("Password reset successful! Redirecting to login...");
                setTimeout(() => {
                    if (onBackToLogin) {
                        onBackToLogin();
                    } else {
                        router.replace("/");
                    }
                }, 1500);
            } else {
                setErrorPopup({ 
                    open: true, 
                    message: "Failed to reset password. Please try again.", 
                    type: "error" 
                });
                setMessage(null);
            }
        } catch (error: any) {
            setErrorPopup({ 
                open: true, 
                message: error.message || "An error occurred. Please try again.", 
                type: "error" 
            });
            setMessage(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md relative z-10">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
                {/* Logo/Brand */}
                <div className="flex items-center justify-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        Car<span className="text-orange-500">vo</span>
                    </h2>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">
                        {step === 1 ? "Forgot Password" : "Reset Password"}
                    </h3>
                    {onBackToLogin && (
                        <button
                            onClick={onBackToLogin}
                            className="text-sm text-orange-400 hover:text-orange-300 transition-colors duration-200"
                        >
                            Back to Login
                        </button>
                    )}
                </div>

                <p className="text-sm text-gray-400 mb-6">
                    {step === 1 
                        ? "Enter your email address and we'll send you a code to reset your password if such email exists."
                        : "Enter the code sent to your email and your new password."}
                </p>

                {message && (
                    <div className={`mb-4 rounded-lg px-4 py-3 text-sm border ${
                        message.includes('sent') || message.includes('successful')
                            ? 'bg-green-900/50 text-green-400 border-green-800' 
                            : 'bg-blue-900/50 text-blue-400 border-blue-800'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="carvocare@carvo.com"
                                className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-4 py-3 shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP + New Password */}
                {step === 2 && (
                    <form onSubmit={handlePasswordReset} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="otpCode">
                                Reset Code (OTP)
                            </label>
                            <input
                                id="otpCode"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="newPassword">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirmPassword">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className={`w-full rounded-xl border ${
                                    !passwordMatch && confirmPassword 
                                        ? 'border-red-500 focus:ring-red-500/30' 
                                        : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/30'
                                } bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:ring-2 focus:bg-gray-700 transition-all duration-200`}
                                disabled={isLoading}
                            />
                            {!passwordMatch && confirmPassword && (
                                <p className="mt-2 text-sm text-red-400">
                                    Passwords do not match
                                </p>
                            )}
                            {passwordMatch && confirmPassword && newPassword && (
                                <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    Passwords match
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !passwordMatch}
                            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-4 py-3 shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep(1);
                                setOtp("");
                                setNewPassword("");
                                setConfirmPassword("");
                                setMessage(null);
                            }}
                            className="w-full text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200"
                            disabled={isLoading}
                        >
                            Didn't receive the code? Resend
                        </button>
                    </form>
                )}
            </div>

            {/* Error Popup */}
            <ErrorPopUp
                open={errorPopup.open}
                onClose={() => setErrorPopup({ ...errorPopup, open: false })}
                message={errorPopup.message}
                type={errorPopup.type}
            />
        </div>
    );
}
