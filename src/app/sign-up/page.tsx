"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { signUpClientAction } from "@/lib/actions/auth-actions";
import { evaluatePasswordStrength } from "@/lib/validations/auth";

export default function SignUpPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const strength = evaluatePasswordStrength(password);

  useEffect(() => {
    document.title = "Sign Up | Affan er Tong";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setSuccessMessage("");
    setLoading(true);

    const result = await signUpClientAction({
      displayName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      if (result.errors) {
        setFieldErrors(result.errors);
      }
      setGeneralError(result.message || "Sign up failed. Please check form details.");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      return;
    }

    setSuccessMessage(result.message || "Check your email to confirm your account.");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);

    if (result.redirectTo) {
      setTimeout(() => {
        router.push(result.redirectTo!);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header user={null} onOpenAuth={() => {}} onSignOut={() => {}} />

      <main id="main-content" className="flex-1 py-12 md:py-20 flex items-center justify-center p-4 paper-grain">
        <div className="bg-[#F5F0E6] text-[#171717] max-w-lg w-full p-6 sm:p-8 border border-[#171717]/20 shadow-2xl space-y-6">
          
          <div className="border-b border-[#171717]/15 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87525]" />
              <span>DEBATER REGISTRATION</span>
            </div>

            <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
              JOIN AFFAN ER TONG
            </h1>

            <p className="text-xs text-[#171717]/80 mt-1">
              Create your account to access learning path modules, practice motions, and community open floors.
            </p>

            {generalError && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-bold mt-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{generalError}</span>
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
            <div>
              <label htmlFor="displayName" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                Full Name / Display Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
                <input
                  id="displayName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Tanvir Ahmed"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full pl-9 pr-4 py-3 bg-white border text-xs text-[#171717] focus:outline-none ${
                    fieldErrors.displayName ? "border-red-500" : "border-[#171717]/20 focus:border-[#E87525]"
                  }`}
                />
              </div>
              {fieldErrors.displayName && (
                <p className="text-[11px] text-red-600 font-bold mt-1">{fieldErrors.displayName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-4 py-3 bg-white border text-xs text-[#171717] focus:outline-none ${
                    fieldErrors.email ? "border-red-500" : "border-[#171717]/20 focus:border-[#E87525]"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-red-600 font-bold mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                Password * (Min 12 characters)
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
                  className={`w-full pl-9 pr-10 py-3 bg-white border text-xs text-[#171717] focus:outline-none ${
                    fieldErrors.password ? "border-red-500" : "border-[#171717]/20 focus:border-[#E87525]"
                  }`}
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

              {password && (
                <div className="mt-2 p-2.5 bg-white border border-[#171717]/15 space-y-1.5 font-mono text-[11px]">
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

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#625E57] pt-1">
                    <span className={strength.hasMinLength ? "text-emerald-700 font-bold" : ""}>
                      {strength.hasMinLength ? "✓" : "•"} 12+ characters
                    </span>
                    <span className={strength.hasUpperAndLower ? "text-emerald-700 font-bold" : ""}>
                      {strength.hasUpperAndLower ? "✓" : "•"} Upper &amp; lower
                    </span>
                    <span className={strength.hasNumber ? "text-emerald-700 font-bold" : ""}>
                      {strength.hasNumber ? "✓" : "•"} Number
                    </span>
                    <span className={strength.hasSpecialChar ? "text-emerald-700 font-bold" : ""}>
                      {strength.hasSpecialChar ? "✓" : "•"} Special character
                    </span>
                  </div>
                </div>
              )}

              {fieldErrors.password && (
                <p className="text-[11px] text-red-600 font-bold mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                Confirm Password *
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
                  className={`w-full pl-9 pr-10 py-3 bg-white border text-xs text-[#171717] focus:outline-none ${
                    fieldErrors.confirmPassword ? "border-red-500" : "border-[#171717]/20 focus:border-[#E87525]"
                  }`}
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
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] text-red-600 font-bold mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] py-3.5 bg-[#E87525] hover:bg-[#171717] text-[#F5F0E6] font-condensed text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#171717]/15 text-center text-xs">
            <span className="text-[#171717]/70">Already have an account? </span>
            <Link href="/sign-in" className="text-[#E87525] hover:underline font-bold">
              Sign In Here ↗
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
