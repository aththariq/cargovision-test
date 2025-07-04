"use client";

/*
 * WARNING: This component stores passwords in localStorage when "Remember me" is checked.
 * This is a SECURITY RISK and should not be used in production.
 * Consider using secure session tokens or browser password managers instead.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { signIn } = useAuth();

  // Pre-populate email & remember flag if it was stored previously (see useEffect below)

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load remembered credentials if present
      const savedEmail = localStorage.getItem("loginEmail");
      const savedPassword = localStorage.getItem("loginPassword"); // WARNING: Security risk!
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedPassword) {
        setPassword(savedPassword); // WARNING: Security risk!
      }
      const token = localStorage.getItem("token");
      if (token) {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("https://api.cargovision.app/user/auth/email/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Login failed");
      }

      const resJson = await res.json();

      const apiUserData = resJson.data || {};
      const token = apiUserData.token || resJson.token || "";
      const userEmail = apiUserData.email || resJson.email || email;

      // Build user data object
      const userData = {
        name: userEmail.split("@")[0],
        email: userEmail,
      };
      
      // Persist token via context helper (handles cookie & localStorage)
      signIn(token, userData, rememberMe);

      // Store or clear remembered credentials based on the checkbox
      if (rememberMe) {
        localStorage.setItem("loginEmail", email);
        localStorage.setItem("loginPassword", password); // WARNING: Security risk!
      } else {
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("loginPassword");
      }
      // redirect or further logic
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "https://api.cargovision.app/user/auth/google";
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

      {/* Right side - Login Form */}
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
            <h1 className="text-3xl font-bold" style={{ color: '#12295F' }}>Welcome Back</h1>
            <p className="text-gray-600">Enter your email and password to access your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: '#2A8AFB' }}>
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Remember me"
              />
              <Link 
                href="/forgot-password" 
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: '#2A8AFB' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#2A8AFB' }}
            >
              {loading ? "Signing In..." : "Sign In"}
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

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
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
            Sign In with Google
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link 
              href="/signup" 
              className="font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#2A8AFB' }}
            >
              Sign Up
            </Link>
          </div>

          {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
} 