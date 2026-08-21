"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TurnstileCaptcha from "@/components/TurnstileCaptcha";
import { resetPasswordClientAction } from "@/lib/actions/auth-actions";
import { evaluatePasswordStrength } from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const result = await resetPasswordClientAction({
      password,
      confirmPassword,
      captchaToken,
    });

    if (!result.success) {
      setErrorMessage(result.message || "Failed to update password.");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      return;
    }

    setSuccessMessage(result.message || "Password updated successfully. Redirecting to sign in...");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);

    setTimeout(() => {
      router.push("/sign-in");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header user={null} onOpenAuth={() => {}} onSignOut={() => {}} />

      <main id="main-content" className="flex-1 py-12 md:py-20 flex items-center justify-center p-4 paper-grain">
        <div className="bg-[#F5F0E6] text-[#171717] max-w-md w-full p-6 sm:p-8 border border-[#171717]/20 shadow-2xl space-y-6">
          
          <div className="border-b border-[#171717]/15 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87525]" />
              <span>SECURE PASSWORD UPDATE</span>
            </div>

            <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
              RESET PASSWORD
            </h1>

            <p className="text-xs text-[#171717]/80 mt-1">
              Set a strong new password for your Affan er Tong debater account.
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-bold mt-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mt-3 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
            
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                New Password * (Min 12 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#171717]/60 hover:text-[#171717]"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Indicator */}
              {password && (
                <div className="mt-2 p-2.5 bg-white border border-[#171717]/15 space-y-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#171717]/70">Password Strength:</span>
                    <span
                      className={`font-bold uppercase ${
                        strength.score <= 1
                          ? "text-red-600"
                          : strength.score === 2
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength.score <= 1
                          ? "bg-red-500"
                          : strength.score === 2
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#171717]/60 hover:text-[#171717]"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <TurnstileCaptcha onVerify={(token) => setCaptchaToken(token)} />

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] py-3.5 bg-[#E87525] hover:bg-[#171717] text-[#F5F0E6] font-condensed text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{loading ? "Updating Password..." : "Update Password"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
