"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, ArrowRight } from "lucide-react";
import { signUpClientAction, signInClientAction } from "@/lib/actions/auth-actions";

interface UserProfile {
  email: string;
  name: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  actionIntent?: string;
}

export default function AuthModal({ isOpen, onClose, onSuccess, actionIntent }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (isSignUp) {
      const result = await signUpClientAction({
        displayName,
        email,
        password,
        confirmPassword: password,
      });

      if (!result.success) {
        setErrorMessage(result.message || "Failed to create account.");
        setPassword("");
        setLoading(false);
        return;
      }

      onSuccess({
        email,
        name: displayName || email.split("@")[0],
      });
      setLoading(false);
      onClose();
    } else {
      const result = await signInClientAction({
        email,
        password,
      });

      if (!result.success) {
        setErrorMessage(result.message || "Unable to sign in with those credentials.");
        setPassword("");
        setLoading(false);
        return;
      }

      onSuccess({
        email,
        name: email.split("@")[0],
      });
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans overflow-y-auto">
      <div className="bg-[#F5F0E6] text-[#171717] max-w-md w-full p-6 sm:p-8 relative border border-[#171717]/20 shadow-2xl max-h-[calc(100dvh-32px)] overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#171717] hover:text-[#E87525] min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-4 border-b border-[#171717]/15">
          <div className="text-xs font-mono font-bold uppercase text-[#E87525] tracking-wider mb-1">
            ACCOUNT ACCESS
          </div>
          <h3 className="font-condensed text-3xl sm:text-4xl uppercase tracking-wider text-[#171717]">
            {isSignUp ? "Join the Community" : "Sign In"}
          </h3>

          {actionIntent && (
            <p className="text-xs text-[#171717]/80 mt-2 font-medium bg-[#D7D0C4]/40 p-2.5 border border-[#171717]/15">
              Create an account or sign in to {actionIntent}.
            </p>
          )}

          {errorMessage && (
            <p className="text-[11px] font-bold text-[#E87525] mt-2 uppercase font-condensed tracking-wider">
              {errorMessage}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
          {isSignUp && (
            <div>
              <label htmlFor="modalDisplayName" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                Full Name / Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
                <input
                  id="modalDisplayName"
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="modalEmail" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
              <input
                id="modalEmail"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="modalPassword" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
              <input
                id="modalPassword"
                type="password"
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] py-3.5 bg-[#E87525] hover:bg-[#171717] text-[#F5F0E6] font-condensed text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <span>{loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#171717]/15 text-center text-xs">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage("");
            }}
            className="text-[#171717] hover:underline font-bold py-2"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
