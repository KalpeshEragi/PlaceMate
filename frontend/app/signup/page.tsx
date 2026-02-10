'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { ArrowRight, Sparkles, UserPlus, LogIn, Briefcase, Users, Zap, CheckCircle2 } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  
  // Signup states
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupCollege, setSignupCollege] = useState('')
  const [signupError, setSignupError] = useState('')
  const [isSignupLoading, setIsSignupLoading] = useState(false)

  const router = useRouter()
  const { login, signup } = useAuth()

  const handleToggle = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
      setIsAnimating(false)
    }, 300)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoginLoading(true)
    try {
      await login(loginEmail, loginPassword)
      router.push('/dashboard')
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError('')
    setIsSignupLoading(true)
    try {
      await signup(signupEmail, signupPassword, signupName, signupCollege)
      router.push('/dashboard')
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsSignupLoading(false)
    }
  }

  const features = [
    { icon: Zap, text: "AI-Powered Resume Builder" },
    { icon: Users, text: "Connect with Peers" },
    { icon: Briefcase, text: "Smart Job Matching" },
  ]

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Left Panel - Info Side */}
      <div 
        className={`hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-700 ease-in-out ${
          isLogin ? 'order-1' : 'order-2'
        }`}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://kimi-web-img.moonshot.cn/img/goodearthplants.com/71040109d93c4fd4c1a55cd377c39e0911ff4e3b.jpg" 
            alt="Workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-blue-900/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white w-full">
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-2xl font-bold">P</span>
              </div>
              <span className="text-2xl font-bold">PlaceMate</span>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
            </h2>
            
            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-md">
              {isLogin 
                ? 'Sign in to continue your placement journey and connect with opportunities that match your skills.'
                : 'Join thousands of students who have landed their dream jobs through our AI-powered platform.'
              }
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm text-white/60 mb-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button 
                onClick={handleToggle}
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-8"
              >
                {isLogin ? (
                  <><UserPlus className="mr-2 w-4 h-4" /> Create Account</>
                ) : (
                  <><LogIn className="mr-2 w-4 h-4" /> Sign In</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Side */}
      <div 
        className={`w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 transition-all duration-700 ease-in-out ${
          isLogin ? 'order-2' : 'order-1'
        }`}
      >
        <div className={`w-full max-w-md transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Mobile Toggle */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="font-bold text-lg">PlaceMate</span>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? 'Welcome back to PlaceMate' : 'Join our community today'}
              </p>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-muted-foreground/30" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>

                {loginError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {loginError}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11 rounded-xl border-muted-foreground/20 hover:bg-muted/50">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-11 rounded-xl border-muted-foreground/20 hover:bg-muted/50">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 font-semibold flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Demo Credentials
                  </p>
                  <p className="text-xs text-muted-foreground">Email: demo@example.com</p>
                  <p className="text-xs text-muted-foreground">Password: demo123</p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-college" className="text-sm font-medium">College/University</Label>
                  <Input
                    id="signup-college"
                    type="text"
                    placeholder="Your College Name"
                    value={signupCollege}
                    onChange={(e) => setSignupCollege(e.target.value)}
                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary/20"
                    required
                  />
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full bg-muted-foreground/20" />
                    ))}
                  </div>
                </div>

                {signupError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {signupError}
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1 rounded border-muted-foreground/30" required />
                  <span className="text-muted-foreground text-xs">
                    I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isSignupLoading}
                >
                  {isSignupLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11 rounded-xl border-muted-foreground/20 hover:bg-muted/50">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-11 rounded-xl border-muted-foreground/20 hover:bg-muted/50">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </Button>
                </div>
              </form>
            )}

            {/* Mobile Toggle Link */}
            <div className="lg:hidden mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={handleToggle}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}