"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [verifyLink, setVerifyLink] = useState("");
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const passwordsMatch = password === confirmPassword;

  // Polling effect to check verification status
  useEffect(() => {
    if (verifyLink && !emailVerified) {
      // Start polling every 5 seconds
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(verifyLink);
          if (res.ok) {
            const json = await res.json();
            if (json?.data?.isVerified) {
              setEmailVerified(true);
              setVerifying(false);
              if (pollRef.current) clearInterval(pollRef.current);
            }
          }
        } catch {
          // Intentionally ignore errors from polling
        }
      }, 5000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [verifyLink, emailVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!emailVerified) {
      setErrorMsg("Please verify your email first");
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      setErrorMsg("Please agree to the Terms");
      return;
    }
    setRegistering(true);
    try {
      const res = await fetch("https://api.cargovision.app/user/auth/email/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Registration failed");
      }
      // success
      router.push("/login");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = "https://api.cargovision.app/user/auth/google";
  };

  const handleVerifyEmail = async () => {
    setErrorMsg("");
    setVerifying(true);
    try {
      const res = await fetch("https://api.cargovision.app/user/auth/email/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Verification failed");
      }
      const json = await res.json();
      const link = json?.data?.verificationCheck;
      if (link) {
        setVerifyLink(link);
      } else {
        setEmailVerified(true);
        setVerifying(false);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Verification failed");
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/auth.jpg"
          alt="Authentication"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Back to Home */}
          <Link 
            href="/" 
            className="inline-flex items-center font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#2A8AFB' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Logo/Icon */}
          <div>
            <Image src="/Icon.png" alt="CargoVision Logo" width={48} height={48} />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold" style={{ color: '#12295F' }}>Create Account</h1>
            <p className="text-gray-600">Join CargoVision to start your secure inspection journey</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with Verify Button */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: '#2A8AFB' }}>
                Email
              </label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 flex-1"
                />
                <Button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={verifying || emailVerified || !email}
                  className="h-12 px-4 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#2A8AFB' }}
                >
                  {emailVerified ? "Verified" : verifying ? "Verifying..." : "Send Verification"}
                </Button>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: '#2A8AFB' }}>
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!emailVerified}
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:opacity-80 transition-opacity"
                  style={{ color: '#2A8AFB' }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: '#2A8AFB' }}>
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!emailVerified}
                  className={`h-12 pr-10 ${confirmPassword && !passwordsMatch ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:opacity-80 transition-opacity"
                  style={{ color: '#2A8AFB' }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-4">
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                label={
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="hover:opacity-80 transition-opacity" style={{ color: '#2A8AFB' }}>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="hover:opacity-80 transition-opacity" style={{ color: '#2A8AFB' }}>
                      Privacy Policy
                    </Link>
                  </span>
                }
              />
            </div>

            {/* Create Account Button */}
            <Button 
              type="submit" 
              disabled={!agreeToTerms || !emailVerified || !passwordsMatch || registering}
              className="w-full h-12 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{ backgroundColor: (!agreeToTerms || !emailVerified || !passwordsMatch) ? '#9CA3AF' : '#2A8AFB' }}
            >
              {registering ? "Creating..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-gray-500">Or</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
            className="w-full h-12 hover:bg-blue-50 transition-colors"
            style={{ borderColor: '#2A8AFB' }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign Up with Google
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link 
              href="/login" 
              className="font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#2A8AFB' }}
            >
              Sign In
            </Link>
          </div>

          {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}

          {/* Password mismatch message */}
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-red-600 text-center">Passwords do not match</p>
          )}
        </div>
      </div>
    </div>
  );
} 